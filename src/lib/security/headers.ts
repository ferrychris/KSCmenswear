import { config } from '@/config';

// CSP directives with strict security policies
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React
    'https://cdn.shopify.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'style-src': ["'self'", "'unsafe-inline'"], // Required for styled-components
  'img-src': [
    "'self'",
    'data:',
    'https:',
    `https://${config.shopify.storeDomain}`,
    'https://images.unsplash.com'
  ],
  'connect-src': [
    "'self'",
    `https://${config.shopify.storeDomain}`,
    'https://www.google-analytics.com',
    'https://stats.g.doubleclick.net'
  ],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Generate CSP header string
export function generateCSPHeader(): string {
  return Object.entries(cspDirectives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

// Security headers configuration
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': generateCSPHeader(),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // XSS Protection
  'X-XSS-Protection': '1; mode=block',
  
  // HSTS (uncomment in production with proper SSL)
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Cookie configuration
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// CSRF Token configuration
export const csrfConfig = {
  cookie: {
    ...cookieOptions,
    key: 'XSRF-TOKEN',
  },
  header: 'X-XSRF-TOKEN',
};