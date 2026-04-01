import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'cairntech_fallback_secret_change_in_production';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first (Bearer token from localStorage)
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7).trim();
    if (token && token !== 'null' && token !== 'undefined') return token;
  }
  // Fallback to HTTP-only cookie
  const cookie = req.cookies.get('admin_token')?.value;
  if (cookie && cookie !== 'null' && cookie !== 'undefined') return cookie;
  return null;
}

export function requireAdmin(req: NextRequest): any {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
