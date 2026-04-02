import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as OrderService from '../services/order.service';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'El carrito está vacío' });
      return;
    }

    const order = await OrderService.createOrder(userId, cartItems);
    res.status(201).json({ message: 'Pedido creado exitosamente', order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const orders = await OrderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};
