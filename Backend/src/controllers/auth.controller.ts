import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ message: 'Usuario creado exitosamente', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({ message: 'Login exitoso', ...result });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
