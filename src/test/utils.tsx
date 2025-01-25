import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

export function renderWithProviders(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    axe: async () => {
      const { container } = render(ui, {
        wrapper: ({ children }) => (
          <BrowserRouter>
            {children}
          </BrowserRouter>
        ),
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    },
    ...render(ui, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          {children}
        </BrowserRouter>
      ),
    }),
  };
}

export * from '@testing-library/react';
export { userEvent };