import { describe, it, expect } from 'vitest';
import { ProductCard } from './ProductCard';
import { renderWithProviders } from '@/test/utils';

const mockProduct = {
  id: 'test-id',
  title: 'Test Product',
  handle: 'test-product',
  priceRange: {
    minVariantPrice: {
      amount: '29.99',
      currencyCode: 'USD',
    },
  },
  images: {
    edges: [
      {
        node: {
          url: 'https://example.com/test.jpg',
          altText: 'Test image',
          width: 800,
          height: 600,
        },
      },
    ],
  },
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const { getByText, getByAltText } = renderWithProviders(
      <ProductCard product={mockProduct} />
    );

    expect(getByText('Test Product')).toBeInTheDocument();
    expect(getByText('$29.99')).toBeInTheDocument();
    expect(getByAltText('Test image')).toHaveAttribute(
      'src',
      'https://example.com/test.jpg'
    );
  });

  it('links to the correct product page', () => {
    const { container } = renderWithProviders(
      <ProductCard product={mockProduct} />
    );

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/products/test-product');
  });
});