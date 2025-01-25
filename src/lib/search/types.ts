export interface SearchResult {
  item: any;
  score: number;
}

export interface SearchOptions {
  fuzzy?: boolean;
  limit?: number;
  filters?: FilterOptions;
}

export interface FilterOptions {
  category?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface SearchAnalytics {
  query: string;
  count: number;
  avgDuration: number;
  lastSearched: string;
  cacheHits: number;
  totalSearches: number;
}

export interface SearchSuggestion {
  text: string;
  score: number;
}