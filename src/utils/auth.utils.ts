/**
 * Simple MD5-like hash function for password validation
 * Note: This is for demonstration. In production, use proper hashing (bcrypt, argon2, etc.)
 */
export async function simpleHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => {
    // Fallback to SHA-256 if MD5 is not available
    return crypto.subtle.digest('SHA-256', data);
  });
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Validates password against stored hash
 */
export async function validatePassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await simpleHash(password);
  return passwordHash === hash;
}

/**
 * Session storage keys
 */
export const ADMIN_SESSION_KEY = 'admin_session';

/**
 * Stores admin session in sessionStorage
 */
export function setAdminSession(isAuthenticated: boolean): void {
  if (isAuthenticated) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

/**
 * Checks if admin session exists
 */
export function hasAdminSession(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

/**
 * Clears admin session
 */
export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
