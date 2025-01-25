export interface StorageAdapter {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface PersistenceConfig {
  storage?: 'local' | 'session';
  version?: string;
  encrypt?: boolean;
  compress?: boolean;
  validate?: boolean;
  schema?: any;
}

export interface MigrationStrategy {
  (data: any): Promise<any>;
}

export interface StorageMetrics {
  operations: number;
  reads: number;
  writes: number;
  totalDuration: number;
  averageDuration: number;
  totalSize: number;
  migrations: MigrationRecord[];
}

export interface MigrationRecord {
  timestamp: string;
  fromVersion: string;
  toVersion: string;
  duration: number;
  success: boolean;
  error?: string;
}

export interface VersionInfo {
  version: string;
  timestamp: string;
}

export interface StorageError {
  operation: string;
  key: string;
  message: string;
  timestamp: string;
}