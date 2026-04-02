import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'secretKeyAbungaDefault';
    const decoded = jwt.verify(token, secret) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
  }
};
