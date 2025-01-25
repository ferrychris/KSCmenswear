import { http, HttpResponse } from 'msw';
import { config } from '@/config';

export const handlers = [
  http.post(`${config.shopify.storefrontUrl}`, async ({ request }) => {
    const { query, variables } = await request.json();

    // Mock different GraphQL queries
    if (query.includes('getProducts')) {
      return HttpResponse.json({
        data: {
          products: {
            edges: [
              {
                node: {
                  id: 'product-1',
                  title: 'Test Product',
                  handle: 'test-product',
                  description: 'Test description',
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
                  variants: {
                    edges: [
                      {
                        node: {
                          id: 'variant-1',
                          title: 'Small',
                          price: {
                            amount: '29.99',
                            currencyCode: 'USD',
                          },
                          selectedOptions: [
                            {
                              name: 'Size',
                              value: 'Small',
                            },
                          ],
                          quantityAvailable: 10,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      });
    }

    return HttpResponse.json({ data: null });
  }),
];