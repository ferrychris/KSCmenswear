import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';

interface SyncQueue {
  id: string;
  operation: 'create' | 'update' | 'delete';
  storeName: string;
  data: any;
  timestamp: number;
  retries: number;
}

export class OfflineManager {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'kct-offline-store';
  private readonly DB_VERSION = 1;
  private syncQueue: SyncQueue[] = [];
  private isSyncing = false;
  private networkStatus: 'online' | 'offline' = 'online';

  constructor() {
    this.initNetworkListeners();
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores with indexes
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'category');
          productStore.createIndex('updatedAt', 'updatedAt');
        }

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id' });
          cartStore.createIndex('updatedAt', 'updatedAt');
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'id' });
        }
      };
    });
  }

  // Data Operations
  async saveData(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const startTime = performance.now();
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Add timestamp for sync
      const enrichedData = {
        ...data,
        updatedAt: Date.now(),
      };

      await this.withTransaction(transaction, async () => {
        await store.put(enrichedData);
      });

      // Add to sync queue if offline
      if (this.networkStatus === 'offline') {
        await this.addToSyncQueue({
          operation: 'update',
          storeName,
          data: enrichedData,
          timestamp: Date.now(),
          retries: 0,
        });
      }

      performanceMonitor.trackCustomMetric('offline_storage', {
        operation: 'write',
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (error) {
      performanceMonitor.trackError('offline_storage', {
        operation: 'write',
        store: storeName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getData<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const startTime = performance.now();
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const result = await this.promisifyRequest<T>(store.get(id));

      performanceMonitor.trackCustomMetric('offline_storage', {
        operation: 'read',
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });

      return result;
    } catch (error) {
      performanceMonitor.trackError('offline_storage', {
        operation: 'read',
        store: storeName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  async getAllData<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const startTime = performance.now();
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const result = await this.promisifyRequest<T[]>(store.getAll());

      performanceMonitor.trackCustomMetric('offline_storage', {
        operation: 'read_all',
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });

      return result || [];
    } catch (error) {
      performanceMonitor.trackError('offline_storage', {
        operation: 'read_all',
        store: storeName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  async removeData(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const startTime = performance.now();
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      await this.withTransaction(transaction, async () => {
        await store.delete(id);
      });

      // Add to sync queue if offline
      if (this.networkStatus === 'offline') {
        await this.addToSyncQueue({
          operation: 'delete',
          storeName,
          data: { id },
          timestamp: Date.now(),
          retries: 0,
        });
      }

      performanceMonitor.trackCustomMetric('offline_storage', {
        operation: 'delete',
        store: storeName,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (error) {
      performanceMonitor.trackError('offline_storage', {
        operation: 'delete',
        store: storeName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Sync Management
  private async addToSyncQueue(operation: Omit<SyncQueue, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');

    await this.withTransaction(transaction, async () => {
      await store.add(operation);
    });
  }

  private async processSyncQueue(): Promise<void> {
    if (this.isSyncing || this.networkStatus === 'offline') return;

    try {
      this.isSyncing = true;
      const queue = await this.getAllData<SyncQueue>('syncQueue');

      for (const item of queue) {
        try {
          await this.syncItem(item);
          await this.removeData('syncQueue', item.id);
        } catch (error) {
          console.error('Sync failed for item:', item, error);
          
          // Increment retry count
          if (item.retries < 3) {
            await this.saveData('syncQueue', {
              ...item,
              retries: item.retries + 1,
            });
          }
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueue): Promise<void> {
    // Implement API calls to sync with backend
    switch (item.operation) {
      case 'create':
      case 'update':
        // await api.post(`/${item.storeName}`, item.data);
        break;
      case 'delete':
        // await api.delete(`/${item.storeName}/${item.data.id}`);
        break;
    }
  }

  // Network Status Management
  private initNetworkListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Initial status
    this.networkStatus = navigator.onLine ? 'online' : 'offline';
  }

  private handleOnline = (): void => {
    this.networkStatus = 'online';
    this.processSyncQueue();
  };

  private handleOffline = (): void => {
    this.networkStatus = 'offline';
  };

  // Utility Methods
  private async withTransaction(
    transaction: IDBTransaction,
    operation: () => Promise<void>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
      
      operation().catch(reject);
    });
  }

  private promisifyRequest<T>(request: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup
  dispose(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Validation schemas
const StoreNameSchema = z.enum(['products', 'cart', 'userPreferences', 'syncQueue']);

// Export singleton instance
export const offlineManager = new OfflineManager();