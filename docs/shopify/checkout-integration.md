# Shopify Checkout Integration Guide

## Overview
This document details the implementation of Shopify checkout integration, including common issues encountered and their solutions.

## Key Components

### 1. Cart Store Configuration
The cart store must track both product IDs and variant IDs:

```typescript
interface CartItem {
  id: string;          // Product ID
  variantId: string;   // Variant ID from Shopify
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}
```

### 2. Checkout URL Construction
The correct format for Shopify checkout URLs is:
```
https://{store-domain}/cart/{variantId}:{quantity}
```

## Common Issues and Solutions

### Issue 1: Invalid Variant IDs
**Problem:** Checkout fails because variant IDs are not properly formatted or missing.

**Solution:**
1. Ensure variant IDs are stored when adding items to cart
2. Remove 'gid://shopify/ProductVariant/' prefix before creating checkout URL
3. Update cart store to use variant IDs for item management

```typescript
// Example fix in CartDrawer.tsx
const handleCheckout = async () => {
  try {
    const lineItems = items.map(item => {
      const variantId = item.variantId.replace('gid://shopify/ProductVariant/', '');
      return `${variantId}:${item.quantity}`;
    });
    
    const checkoutUrl = `https://${config.shopify.storeDomain}/cart/${lineItems.join(',')}`;
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error initiating checkout:', error);
    alert('There was an error initiating checkout. Please try again.');
  }
};
```

### Issue 2: Cart Item Management
**Problem:** Unable to remove items or update quantities due to mismatched IDs.

**Solution:**
1. Use variant IDs instead of product IDs for cart operations
2. Update cart store methods to handle variant IDs:

```typescript
removeItem: (variantId: string) => {
  const updatedItems = get().items.filter((item) => item.variantId !== variantId);
  set({
    items: updatedItems,
    total: calculateTotal(updatedItems),
  });
},

updateQuantity: (variantId: string, quantity: number) => {
  if (quantity < 1) return;
  
  const updatedItems = get().items.map((item) =>
    item.variantId === variantId ? { ...item, quantity } : item
  );
  
  set({
    items: updatedItems,
    total: calculateTotal(updatedItems),
  });
},
```

### Issue 3: Product Detail Page Integration
**Problem:** Product variants not properly selected when adding to cart.

**Solution:**
1. Track selected variant state
2. Update product detail page to handle variant selection:

```typescript
const [selectedVariant, setSelectedVariant] = useState<any>(null);

useEffect(() => {
  if (product && selectedSize) {
    const variant = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some(opt =>
        opt.name.toLowerCase() === 'size' &&
        opt.value.toLowerCase() === selectedSize.toLowerCase()
      )
    );
    setSelectedVariant(variant?.node);
  }
}, [product, selectedSize]);
```

## Best Practices

1. **Variant Tracking**
   - Always store variant IDs along with product IDs
   - Use variant IDs for cart operations
   - Validate variant availability before adding to cart

2. **Error Handling**
   - Implement proper error handling for checkout process
   - Show user-friendly error messages
   - Log errors for debugging

3. **URL Construction**
   - Use environment variables for store domain
   - Properly format variant IDs
   - Handle multiple items in cart

4. **Testing**
   - Test checkout with various product combinations
   - Verify cart operations (add, remove, update)
   - Test error scenarios

## Configuration Requirements

1. Environment Variables:
```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
VITE_SHOPIFY_API_VERSION=2024-01
```

2. Shopify API Configuration:
```typescript
const config = {
  shopify: {
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  }
};
```

## Troubleshooting Guide

1. **Checkout URL Not Working**
   - Verify variant IDs are correctly formatted
   - Check store domain configuration
   - Validate cart items structure

2. **Cart Operations Failing**
   - Confirm variant IDs are being used for operations
   - Check cart store implementation
   - Verify product data structure

3. **Product Variants Not Loading**
   - Check Shopify API response format
   - Verify product query includes variant data
   - Validate variant selection logic

## Future Improvements

1. Implement cart validation before checkout
2. Add better error handling and user feedback
3. Consider implementing a cart backup system
4. Add analytics for checkout flow
5. Implement abandoned cart recovery