export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

export interface Cart {
  id: string;
  items: CartItem[];
  currency: Currency;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discountCode?: DiscountCode;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  weight?: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  minimumAmount?: number;
  maximumAmount?: number;
}

export interface TaxRate {
  rate: number;
  region: string;
  rules?: TaxRule[];
}

export interface TaxRule {
  condition: 'category' | 'price' | 'location';
  value: string | number;
  rate: number;
}

export interface ShippingRate {
  name: string;
  baseRate: number;
  weightFactor: number;
  rules?: ShippingRule[];
}

export interface ShippingRule {
  condition: 'weight' | 'price' | 'location' | 'items';
  value: number | string;
  adjustment: number;
}

export interface InventoryStatus {
  available: boolean;
  quantity: number;
  reserved: number;
}

export interface CartAnalytics {
  cartId: string;
  events: CartEvent[];
  metrics: {
    totalValue: number;
    itemCount: number;
    conversionRate: number;
  };
}

export interface CartEvent {
  action: string;
  timestamp: string;
  data: any;
}