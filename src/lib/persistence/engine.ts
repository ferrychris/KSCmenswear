import { z } from 'zod';
import { performanceMonitor } from '../performance/monitor';
import { ErrorRecoveryEngine } from '../error/engine';
import type { 
  StorageAdapter,
  PersistenceConfig,
  MigrationStrategy,
  StorageMetrics,
  VersionInfo,
  StorageError 
} from './types';

export class PersistenceEngine {
  private storage: Map<string, StorageAdapter>;
  private migrations: Map<string, MigrationStrategy>;
  private errorEngine: ErrorRecoveryEngine;
  private metrics: Map<string, StorageMetrics>;
  private versionInfo: Map<string, VersionInfo>;

  constructor() {
    this.storage = new Map();
    this.migrations = new Map();
    this.errorEngine = new ErrorRecoveryEngine();
    this.metrics = new Map();
    this.versionInfo = new Map();
    this.initializeAdapters();
  }

  // Storage Management
  async persist<T>(
    key: string,
    data: T,
    config: PersistenceConfig = {}
  ): Promise<void> {
    const {
      storage = 'local',
      version = '1.0',
      encrypt = false,
      compress = false,
      validate = true,
    } = config;

    try {
      const startTime = performance.now();
      const adapter = this.getStorageAdapter(storage);

      // Validate data if schema is provided
      if (validate && config.schema) {
        config.schema.parse(data);
      }

      // Process data
      let processedData = this.processData(data, { encrypt, compress });

      // Add metadata
      const metadata = {
        version,
        timestamp: new Date().toISOString(),
        checksum: this.calculateChecksum(processedData),
      };

      processedData = {
        data: processedData,
        metadata,
      };

      // Store data
      await adapter.setItem(key, processedData);

      // Update version info
      this.updateVersionInfo(key, version);

      // Track metrics
      this.trackStorageOperation('write', {
        key,
        storage,
        duration: performance.now() - startTime,
        size: this.calculateSize(processedData),
      });
    } catch (error) {
      this.handleError('persist', error, key);
    }
  }

  async retrieve<T>(
    key: string,
    config: PersistenceConfig = {}
  ): Promise<T | null> {
    const {
      storage = 'local',
      version = '1.0',
      encrypt = false,
      compress = false,
      validate = true,
    } = config;

    try {
      const startTime = performance.now();
      const adapter = this.getStorageAdapter(storage);

      // Retrieve data
      const storedData = await adapter.getItem(key);
      if (!storedData) return null;

      // Verify data integrity
      if (!this.verifyChecksum(storedData)) {
        throw new Error('Data integrity check failed');
      }

      // Handle version migration
      const currentVersion = this.versionInfo.get(key)?.version;
      if (currentVersion && currentVersion !== version) {
        await this.migrate(key, currentVersion, version);
      }

      // Process data
      let data = this.processData(storedData.data, {
        encrypt,
        compress,
        decrypt: true,
        decompress: true,
      });

      // Validate data
      if (validate && config.schema) {
        data = config.schema.parse(data);
      }

      // Track metrics
      this.trackStorageOperation('read', {
        key,
        storage,
        duration: performance.now() - startTime,
        size: this.calculateSize(storedData),
      });

      return data;
    } catch (error) {
      return this.handleError('retrieve', error, key);
    }
  }

  // Migration Management
  registerMigration(
    fromVersion: string,
    toVersion: string,
    strategy: MigrationStrategy
  ): void {
    const migrationKey = `${fromVersion}->${toVersion}`;
    this.migrations.set(migrationKey, strategy);
  }

  async migrate(
    key: string,
    fromVersion: string,
    toVersion: string
  ): Promise<void> {
    const migrationKey = `${fromVersion}->${toVersion}`;
    const strategy = this.migrations.get(migrationKey);

    if (!strategy) {
      throw new Error(`No migration strategy found for ${migrationKey}`);
    }

    try {
      const startTime = performance.now();
      const data = await this.retrieve(key, { version: fromVersion });
      
      if (data) {
        const migratedData = await strategy(data);
        await this.persist(key, migratedData, { version: toVersion });
      }

      // Track migration metrics
      this.trackMigration(key, {
        fromVersion,
        toVersion,
        duration: performance.now() - startTime,
        success: true,
      });
    } catch (error) {
      this.trackMigration(key, {
        fromVersion,
        toVersion,
        duration: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Storage Adapters
  private initializeAdapters(): void {
    // Local Storage Adapter
    this.storage.set('local', {
      async getItem(key: string) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      async setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      async removeItem(key: string) {
        localStorage.removeItem(key);
      },
    });

    // Session Storage Adapter
    this.storage.set('session', {
      async getItem(key: string) {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      async setItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
      },
      async removeItem(key: string) {
        sessionStorage.removeItem(key);
      },
    });
  }

  private getStorageAdapter(type: string): StorageAdapter {
    const adapter = this.storage.get(type);
    if (!adapter) {
      throw new Error(`Storage adapter '${type}' not found`);
    }
    return adapter;
  }

  // Data Processing
  private processData(
    data: any,
    options: {
      encrypt?: boolean;
      decrypt?: boolean;
      compress?: boolean;
      decompress?: boolean;
    }
  ): any {
    let processed = data;

    if (options.decompress) {
      processed = this.decompress(processed);
    }
    if (options.decrypt) {
      processed = this.decrypt(processed);
    }
    if (options.encrypt) {
      processed = this.encrypt(processed);
    }
    if (options.compress) {
      processed = this.compress(processed);
    }

    return processed;
  }

  private encrypt(data: any): any {
    // Implement encryption logic
    return data;
  }

  private decrypt(data: any): any {
    // Implement decryption logic
    return data;
  }

  private compress(data: any): any {
    // Implement compression logic
    return data;
  }

  private decompress(data: any): any {
    // Implement decompression logic
    return data;
  }

  // Integrity Checks
  private calculateChecksum(data: any): string {
    // Implement checksum calculation
    return '';
  }

  private verifyChecksum(data: any): boolean {
    // Implement checksum verification
    return true;
  }

  // Version Management
  private updateVersionInfo(key: string, version: string): void {
    this.versionInfo.set(key, {
      version,
      timestamp: new Date().toISOString(),
    });
  }

  // Metrics Tracking
  private trackStorageOperation(
    operation: 'read' | 'write',
    data: {
      key: string;
      storage: string;
      duration: number;
      size: number;
    }
  ): void {
    const metrics = this.getMetrics(data.key);
    
    metrics.operations++;
    metrics.totalDuration += data.duration;
    metrics.averageDuration = metrics.totalDuration / metrics.operations;
    metrics.totalSize = data.size;

    if (operation === 'write') {
      metrics.writes++;
    } else {
      metrics.reads++;
    }

    this.metrics.set(data.key, metrics);

    performanceMonitor.trackCustomMetric('storage_operation', {
      operation,
      ...data,
    });
  }

  private trackMigration(
    key: string,
    data: {
      fromVersion: string;
      toVersion: string;
      duration: number;
      success: boolean;
      error?: string;
    }
  ): void {
    const metrics = this.getMetrics(key);
    metrics.migrations.push({
      timestamp: new Date().toISOString(),
      ...data,
    });
    this.metrics.set(key, metrics);

    performanceMonitor.trackCustomMetric('storage_migration', data);
  }

  private getMetrics(key: string): StorageMetrics {
    return (
      this.metrics.get(key) || {
        operations: 0,
        reads: 0,
        writes: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalSize: 0,
        migrations: [],
      }
    );
  }

  // Error Handling
  private handleError(
    operation: string,
    error: unknown,
    key: string
  ): never | null {
    const storageError: StorageError = {
      operation,
      key,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    performanceMonitor.trackError('storage_error', storageError);

    if (operation === 'retrieve') {
      // For retrieval errors, return null instead of throwing
      console.error('Storage error:', storageError);
      return null;
    }

    throw new Error(`Storage operation failed: ${storageError.message}`);
  }

  // Utility Methods
  private calculateSize(data: any): number {
    try {
      const str = JSON.stringify(data);
      return new Blob([str]).size;
    } catch {
      return 0;
    }
  }
}

export const persistenceEngine = new PersistenceEngine();