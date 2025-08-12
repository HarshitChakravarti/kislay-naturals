import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  // Access JWT_SECRET at runtime, not at module load time
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'kislay-naturals',
      audience: 'kislay-naturals-users',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate JWT token';
    throw new Error(`JWT generation failed: ${errorMessage}`);
  }
}

export function verifyToken(token: string): JWTPayload {
  // Access JWT_SECRET at runtime, not at module load time
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kislay-naturals',
      audience: 'kislay-naturals-users',
    }) as JWTPayload;
    
    return decoded;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';
    console.error('Token verification failed:', errorMessage);
    throw new Error(`Token verification failed: ${errorMessage}`);
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
} 