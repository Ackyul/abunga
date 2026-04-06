import { Request, Response } from 'express';
import { createCheckoutSessionByOrderId } from '../services/stripe.service';


export const checkoutByOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    if (isNaN(orderId)) {
      res.status(400).json({ error: 'ID de orden inválido' });
      return;
    }

    const origin = (req.headers.origin as string) || process.env.FRONTEND_URL || '';
    const session = await createCheckoutSessionByOrderId(orderId, origin);

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout by order:', error);
    res.status(500).json({ error: error.message });
  }
};
