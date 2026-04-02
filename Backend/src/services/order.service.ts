import prisma from '../lib/prisma';

interface CartItemInput {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedWeight?: string;
}

export const createOrder = async (userId: number, cartItems: CartItemInput[]) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return order;
};

export const getUserOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
