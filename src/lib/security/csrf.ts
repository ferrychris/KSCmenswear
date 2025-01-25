import { z } from 'zod';
import { csrfConfig } from './headers';

export class CSRFProtection {
  private static instance: CSRFProtection;
  private tokenCache: Map<string, { token: string; expires: number }>;

  private constructor() {
    this.tokenCache = new Map();
  }

  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  generateToken(): string {
    const token = crypto.randomUUID();
    const expires = Date.now() + 3600000; // 1 hour expiry
    this.tokenCache.set(token, { token, expires });
    return token;
  }

  validateToken(token: string): boolean {
    const cached = this.tokenCache.get(token);
    if (!cached) return false;
    
    if (Date.now() > cached.expires) {
      this.tokenCache.delete(token);
      return false;
    }
    
    return true;
  }

  setTokenCookie(token: string): void {
    document.cookie = `${csrfConfig.cookie.key}=${token}; ${this.serializeCookieOptions(csrfConfig.cookie)}`;
  }

  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${csrfConfig.cookie.key}=`)
    );
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  }

  private serializeCookieOptions(options: typeof csrfConfig.cookie): string {
    const parts = [];
    if (options.httpOnly) parts.push('HttpOnly');
    if (options.secure) parts.push('Secure');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    if (options.path) parts.push(`Path=${options.path}`);
    if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
    return parts.join('; ');
  }

  // Cleanup expired tokens
  cleanup(): void {
    const now = Date.now();
    for (const [token, data] of this.tokenCache.entries()) {
      if (now > data.expires) {
        this.tokenCache.delete(token);
      }
    }
  }
}

export const csrfProtection = CSRFProtection.getInstance();