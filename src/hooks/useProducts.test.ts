import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useProducts } from './useProducts';

describe('useProducts', () => {
  beforeEach(() => {
    // Reset store state before each test
    vi.resetModules();
  });

  it('fetches products successfully', async () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toHaveLength(0);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].title).toBe('Test Product');
  });

  it('filters products by category', async () => {
    const { result } = renderHook(() => useProducts('test-category'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'test-category',
        }),
      ])
    );
  });
});