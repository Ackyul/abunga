import Stripe from 'stripe';

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
