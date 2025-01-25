# Testing Documentation

## Testing Stack

- Vitest - Unit and integration testing
- React Testing Library - Component testing
- MSW - API mocking
- Playwright - E2E testing

## Running Tests

```bash
# Unit and integration tests
npm test

# With UI
npm run test:ui

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## Writing Tests

### Component Tests

```tsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithProviders(<ComponentName />);
    expect(getByText('Expected text')).toBeInTheDocument();
  });
});
```

### API Mocks

```ts
import { http } from 'msw';

export const handlers = [
  http.post('/api/endpoint', async ({ request }) => {
    // Mock implementation
  }),
];
```

### E2E Tests

```ts
import { test, expect } from '@playwright/test';

test('user flow', async ({ page }) => {
  await page.goto('/');
  // Test implementation
});
```