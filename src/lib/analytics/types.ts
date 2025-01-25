export interface AnalyticsEvent {
  type: string;
  userId: string;
  data: any;
  timestamp: string;
}

export interface UserSession {
  userId: string;
  startTime: string;
  lastActive: string;
  pageViews: number;
  actions: SessionAction[];
}

export interface SessionAction {
  action: string;
  timestamp: string;
  data: any;
}

export interface ProductInteraction {
  productId: string;
  action: 'view' | 'click' | 'add_to_cart' | 'remove_from_cart';
  duration?: number;
  metadata?: Record<string, any>;
}

export interface SearchAnalytics {
  query: string;
  results: number;
  filters?: Record<string, any>;
  duration: number;
  position?: number;
  resultClicked?: string;
}

export interface CartAnalytics {
  action: 'add' | 'remove' | 'update' | 'checkout';
  productId?: string;
  quantity?: number;
  total?: number;
  metadata?: Record<string, any>;
}

export interface VideoEngagement {
  videoId: string;
  action: 'play' | 'pause' | 'seek' | 'complete';
  currentTime: number;
  duration: number;
  quality?: string;
  buffering?: boolean;
}

export interface PerformanceMetrics {
  page: string;
  loadTime: number;
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  resources?: ResourceMetric[];
}

export interface ResourceMetric {
  url: string;
  type: string;
  duration: number;
  size: number;
}

export interface ErrorEvent {
  userId?: string;
  type: string;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export interface CustomEvent {
  userId: string;
  name: string;
  category?: string;
  data: Record<string, any>;
}