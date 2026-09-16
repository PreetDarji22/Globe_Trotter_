import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export interface AuthUserPayload {
  id: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required.');
  }
  return secret;
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });

  try {
    const secret = getJwtSecret();
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
      req.user = user as AuthUserPayload;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal auth configuration error' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isAdmin: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.user.isAdmin = true;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify admin status' });
  }
};
