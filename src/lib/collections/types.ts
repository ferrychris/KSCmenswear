export interface Collection {
  id: string;
  title: string;
  description?: string;
  products: Product[];
  tags: string[];
  rules: CollectionRule[];
  synced: boolean;
  image?: string;
  sortOrder?: string;
  published?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  vendor: string;
  type: string;
  images: string[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku: string;
  inventory: number;
}

export interface CollectionRule {
  condition: 'tag' | 'price' | 'title' | 'vendor' | 'type';
  operator?: 'equals' | 'greater_than' | 'less_than';
  value: string;
}

export interface TagManagementResult {
  added: string[];
  removed: string[];
  updated: string[];
}

export interface SyncResult {
  added: Collection[];
  updated: Collection[];
  removed: Collection[];
  errors: Error[];
}