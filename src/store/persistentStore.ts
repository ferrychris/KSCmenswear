import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistenceEngine } from '@/lib/persistence/engine';

interface CreatePersistentStoreOptions<T> {
  name: string;
  version?: string;
  migrations?: Record<string, (state: T) => T>;
  storage?: 'local' | 'session';
}

export function createPersistentStore<T extends object>(
  options: CreatePersistentStoreOptions<T>,
  createState: (set: any, get: any) => T
) {
  // Register migrations
  if (options.migrations) {
    Object.entries(options.migrations).forEach(([fromVersion, migration]) => {
      const [from, to] = fromVersion.split('->');
      persistenceEngine.registerMigration(from, to, async (state) => {
        return migration(state);
      });
    });
  }

  return create(
    persist(createState, {
      name: options.name,
      version: options.version || 1,
      storage: {
        getItem: async (name) => {
          return persistenceEngine.retrieve(name, {
            storage: options.storage || 'local',
            version: options.version,
          });
        },
        setItem: async (name, value) => {
          return persistenceEngine.persist(name, value, {
            storage: options.storage || 'local',
            version: options.version,
          });
        },
        removeItem: async (name) => {
          const adapter = persistenceEngine['getStorageAdapter'](
            options.storage || 'local'
          );
          return adapter.removeItem(name);
        },
      },
    })
  );
}