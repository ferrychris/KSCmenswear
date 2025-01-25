import { z } from 'zod';
import { MemoryCache } from '../performance/cache';
import type { 
  Cart, 
  CartItem, 
  CartAnalytics, 
  DiscountCode,
  TaxRate,
  ShippingRate,
  Currency,
  InventoryStatus 
} from './types';

export class CartEngine {
  private cache: MemoryCache<Cart>;
  private analytics: Map<string, CartAnalytics>;
  private discountCodes: Map<string, DiscountCode>;
  private taxRates: Map<string, TaxRate>;
  private shippingRates: Map<string, ShippingRate>;
  private exchangeRates: Map<string, number>;

  constructor() {
    this.cache = new MemoryCache(10 * 1024 * 1024); // 10MB cache
    this.analytics = new Map();
    this.discountCodes = new Map();
    this.taxRates = new Map();
    this.shippingRates = new Map();
    this.exchangeRates = new Map();
    this.initializeRates();
  }

  // Cart Operations
  async getCart(cartId: string): Promise<Cart> {
    const cart = this.cache.get(cartId);
    if (cart) return cart;

    const newCart = this.createCart(cartId);
    this.cache.set(cartId, newCart);
    return newCart;
  }

  async addItem(
    cartId: string,
    item: CartItem,
    currency: Currency = 'USD'
  ): Promise<Cart> {
    const cart = await this.getCart(cartId);

    // Check inventory
    const inventoryStatus = await this.checkInventory(item);
    if (!inventoryStatus.available) {
      throw new CartError('Item out of stock', { cause: inventoryStatus });
    }

    // Add or update item
    const existingItem = cart.items.find(i => 
      i.id === item.id && 
      i.variantId === item.variantId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    // Recalculate cart
    await this.recalculateCart(cart, currency);
    this.cache.set(cartId, cart);
    this.trackCartUpdate(cartId, 'add_item', item);

    return cart;
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(cartId);
    cart.items = cart.items.filter(item => item.id !== itemId);
    await this.recalculateCart(cart);
    this.cache.set(cartId, cart);
    this.trackCartUpdate(cartId, 'remove_item', { itemId });
    return cart;
  }

  async updateQuantity(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const item = cart.items.find(i => i.id === itemId);
    
    if (!item) {
      throw new CartError('Item not found in cart');
    }

    // Check inventory for new quantity
    const inventoryStatus = await this.checkInventory({
      ...item,
      quantity,
    });

    if (!inventoryStatus.available) {
      throw new CartError('Requested quantity not available', {
        cause: inventoryStatus,
      });
    }

    item.quantity = quantity;
    await this.recalculateCart(cart);
    this.cache.set(cartId, cart);
    this.trackCartUpdate(cartId, 'update_quantity', { itemId, quantity });
    
    return cart;
  }

  // Discount Code Operations
  async applyDiscountCode(cartId: string, code: string): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const discount = this.discountCodes.get(code);

    if (!discount || !this.isDiscountValid(discount)) {
      throw new CartError('Invalid or expired discount code');
    }

    cart.discountCode = discount;
    await this.recalculateCart(cart);
    this.cache.set(cartId, cart);
    this.trackCartUpdate(cartId, 'apply_discount', { code });

    return cart;
  }

  // Currency Operations
  async convertCurrency(cart: Cart, targetCurrency: Currency): Promise<Cart> {
    const rate = this.exchangeRates.get(targetCurrency);
    if (!rate) {
      throw new CartError('Unsupported currency');
    }

    const convertedCart = {
      ...cart,
      currency: targetCurrency,
      items: cart.items.map(item => ({
        ...item,
        price: this.convertPrice(item.price, rate),
      })),
      subtotal: this.convertPrice(cart.subtotal, rate),
      tax: this.convertPrice(cart.tax, rate),
      shipping: this.convertPrice(cart.shipping, rate),
      total: this.convertPrice(cart.total, rate),
    };

    await this.recalculateCart(convertedCart);
    return convertedCart;
  }

  // Analytics
  getAnalytics(cartId: string): CartAnalytics | undefined {
    return this.analytics.get(cartId);
  }

  // Private helper methods
  private createCart(cartId: string): Cart {
    return {
      id: cartId,
      items: [],
      currency: 'USD',
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async recalculateCart(cart: Cart, currency: Currency = 'USD'): Promise<void> {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply discount if present
    if (cart.discountCode) {
      const discount = this.calculateDiscount(cart.subtotal, cart.discountCode);
      cart.subtotal -= discount;
    }

    // Calculate tax
    cart.tax = await this.calculateTax(cart);

    // Calculate shipping
    cart.shipping = await this.calculateShipping(cart);

    // Calculate total
    cart.total = cart.subtotal + cart.tax + cart.shipping;

    // Convert currency if needed
    if (currency !== cart.currency) {
      const converted = await this.convertCurrency(cart, currency);
      Object.assign(cart, converted);
    }

    cart.updatedAt = new Date().toISOString();
  }

  private async checkInventory(item: CartItem): Promise<InventoryStatus> {
    // Implement real-time inventory check here
    return {
      available: true,
      quantity: 100,
      reserved: 0,
    };
  }

  private calculateDiscount(subtotal: number, discount: DiscountCode): number {
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    }
    return Math.min(discount.value, subtotal);
  }

  private async calculateTax(cart: Cart): Promise<number> {
    // Get applicable tax rate based on location/rules
    const taxRate = 0.08; // Example: 8% tax rate
    return cart.subtotal * taxRate;
  }

  private async calculateShipping(cart: Cart): Promise<number> {
    // Calculate shipping based on items, location, etc.
    const baseRate = 5.99;
    const weightFactor = 0.5;
    const totalWeight = cart.items.reduce(
      (sum, item) => sum + (item.weight || 0) * item.quantity,
      0
    );
    
    return baseRate + totalWeight * weightFactor;
  }

  private convertPrice(price: number, rate: number): number {
    return Math.round((price * rate + Number.EPSILON) * 100) / 100;
  }

  private isDiscountValid(discount: DiscountCode): boolean {
    const now = new Date();
    return (
      (!discount.startDate || new Date(discount.startDate) <= now) &&
      (!discount.endDate || new Date(discount.endDate) >= now) &&
      (!discount.usageLimit || discount.usageCount < discount.usageLimit)
    );
  }

  private trackCartUpdate(cartId: string, action: string, data: any): void {
    const analytics = this.analytics.get(cartId) || {
      cartId,
      events: [],
      metrics: {
        totalValue: 0,
        itemCount: 0,
        conversionRate: 0,
      },
    };

    analytics.events.push({
      action,
      timestamp: new Date().toISOString(),
      data,
    });

    this.analytics.set(cartId, analytics);
  }

  private async initializeRates(): Promise<void> {
    // Initialize exchange rates (would typically fetch from an API)
    this.exchangeRates.set('USD', 1);
    this.exchangeRates.set('EUR', 0.85);
    this.exchangeRates.set('GBP', 0.73);
    this.exchangeRates.set('CAD', 1.25);

    // Initialize tax rates
    this.taxRates.set('default', { rate: 0.08, region: 'default' });

    // Initialize shipping rates
    this.shippingRates.set('standard', {
      name: 'Standard Shipping',
      baseRate: 5.99,
      weightFactor: 0.5,
    });
  }
}

// Error handling
export class CartError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CartError';
  }
}

// Validation schemas
export const CartItemSchema = z.object({
  id: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(1),
  weight: z.number().min(0).optional(),
});