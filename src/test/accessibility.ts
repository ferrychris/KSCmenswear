import { configureAxe } from 'jest-axe';

export function initializeAccessibilityTesting() {
  // Configure axe-core
  configureAxe({
    rules: [
      { id: 'color-contrast', enabled: true },
      { id: 'aria-roles', enabled: true },
      { id: 'button-name', enabled: true },
      { id: 'image-alt', enabled: true },
      { id: 'label', enabled: true },
    ],
  });

  // Add custom matchers
  expect.extend({
    toBeAccessible(received) {
      const { container } = received;
      const results = axe(container);
      return {
        pass: results.violations.length === 0,
        message: () => results.violations.map(v => v.description).join('\n'),
      };
    },
  });
}