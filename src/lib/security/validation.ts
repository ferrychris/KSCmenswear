import { z } from 'zod';
import DOMPurify from 'dompurify';

// Product validation schema
export const ProductSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  handle: z.string().min(1),
  description: z.string(),
  priceRange: z.object({
    minVariantPrice: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }),
  }),
  images: z.object({
    edges: z.array(z.object({
      node: z.object({
        url: z.string().url(),
        altText: z.string().nullable(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    })),
  }),
  variants: z.object({
    edges: z.array(z.object({
      node: z.object({
        id: z.string(),
        title: z.string(),
        price: z.object({
          amount: z.string(),
          currencyCode: z.string(),
        }),
        selectedOptions: z.array(z.object({
          name: z.string(),
          value: z.string(),
        })),
        quantityAvailable: z.number(),
      }),
    })),
  }),
});

// Cart input validation schema
export const CartInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1).max(99),
  selectedSize: z.string().min(1),
  selectedColor: z.string().min(1),
});

// Form validation schema
export const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  ),
  name: z.string().min(2),
});

// API response validation
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  error: z.string().optional(),
});

// Security headers validation
export const SecurityHeadersSchema = z.object({
  'Content-Security-Policy': z.string(),
  'X-Frame-Options': z.string(),
  'X-Content-Type-Options': z.string(),
  'Referrer-Policy': z.string(),
});

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Validate and sanitize user input
 */
export function validateUserInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Escape special characters to prevent SQL injection
 */
export function escapeSQLString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\"+char; // prepends a backslash to backslash, percent, and double/single quotes
      default:
        return char;
    }
  });
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}): boolean {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png'] } = options;

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return true;
}

/**
 * Validate and sanitize URL
 */
export function validateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
}