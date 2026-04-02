import { Request, Response } from 'express';
import * as UserService from '../services/user.service';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};
