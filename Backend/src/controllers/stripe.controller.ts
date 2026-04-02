import { Request, Response } from 'express';
import { createCheckoutSessionService } from '../services/stripe.service';

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    const origin = req.headers.origin || 'http://localhost:5173';
    const session = await createCheckoutSessionService(cartItems, origin);

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};
