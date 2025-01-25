# Component Documentation

This directory contains documentation for all React components in the application.

## Directory Structure

- `layout/` - Layout components documentation
- `products/` - Product-related components documentation
- `ui/` - Reusable UI components documentation
- `cart/` - Shopping cart components documentation

## Component Documentation Template

Each component should be documented using the following structure:

```markdown
# ComponentName

Brief description of the component's purpose and functionality.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |

## Usage

```tsx
import { ComponentName } from '@/components/path/to/component';

function Example() {
  return <ComponentName prop1="value" prop2={42} />;
}
```

## Examples

### Basic Usage
[Example code and description]

### With Custom Styling
[Example code and description]

## Notes

Any additional information, caveats, or important details.

## Related Components

- [RelatedComponent1]
- [RelatedComponent2]
```