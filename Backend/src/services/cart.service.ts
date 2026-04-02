import prisma from '../lib/prisma';

export const getCartByUser = async (userId: number) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
};

export const addItemToCart = async (userId: number, productId: number, quantity: number) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true },
    });
  }

  return await prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
};

export const removeCartItem = async (itemId: number) => {
  return await prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};
