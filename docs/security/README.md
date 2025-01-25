# Security Documentation

## Security Features

### Input Sanitization

All user input is sanitized using the `sanitizeHtml` utility:

```ts
import { sanitizeHtml } from '@/lib/security/validation';

const cleanHtml = sanitizeHtml(userInput);
```

### Rate Limiting

API requests are rate-limited to prevent abuse:

```ts
const rateLimiter = new RateLimiter(50, 60000);
```

### Data Validation

All data is validated using Zod schemas:

```ts
const ProductSchema = z.object({
  id: z.string().min(1),
  // ... rest of schema
});
```

### Security Headers

The application uses the following security headers:

```ts
const headers = {
  'Content-Security-Policy': generateCspHeader(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

## Security Best Practices

1. Always validate user input
2. Use HTTPS for all requests
3. Implement rate limiting
4. Keep dependencies updated
5. Regular security audits
6. Proper error handling
7. Secure session management
8. XSS prevention