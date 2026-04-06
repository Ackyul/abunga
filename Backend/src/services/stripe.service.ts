import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia' as any,
});

export const createCheckoutSessionService = async (cartItems: any[], origin: string) => {
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'pen',
      product_data: {
        name: `${item.name} (${item.selectedWeight})`
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${origin}/catalogo?success=true`,
    cancel_url: `${origin}/cart?canceled=true`,
  });

  return session;
};

export const createCheckoutSessionByOrderId = async (orderId: number, origin: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) throw new Error('Orden no encontrada');
  if (order.items.length === 0) throw new Error('La orden no tiene items');

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'pen',
      product_data: {
        name: item.product?.name ?? `Producto #${item.productId}`,
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${origin}/catalogo?success=true&orderId=${orderId}`,
    cancel_url: `${origin}/cart?canceled=true&orderId=${orderId}`,
    metadata: { orderId: String(orderId) },
  });

  return session;
};
