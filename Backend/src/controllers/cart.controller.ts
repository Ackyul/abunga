import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as CartService from '../services/cart.service';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const cart = await CartService.getCartByUser(userId);
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

export const addItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400).json({ error: 'productId y quantity son requeridos' });
      return;
    }

    const item = await CartService.addItemToCart(userId, Number(productId), Number(quantity));
    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2025' || error.code === 'P2003') {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al agregar al carrito' });
    }
  }
};

export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemId = Number(req.params.id);
    const { quantity } = req.body;

    if (isNaN(itemId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    if (!quantity || quantity < 1) {
      res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
      return;
    }

    const item = await CartService.updateCartItem(itemId, Number(quantity));
    res.status(200).json(item);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Item no encontrado en el carrito' });
    } else {
      res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
  }
};

export const removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemId = Number(req.params.id);
    if (isNaN(itemId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    await CartService.removeCartItem(itemId);
    res.status(200).json({ message: 'Item eliminado del carrito' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Item no encontrado en el carrito' });
    } else {
      res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    await CartService.clearCart(userId);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};
