import prisma from '../lib/prisma';

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: { category: true }
  });
};

export const createProduct = async (data: any) => {
  return await prisma.product.create({
    data,
  });
};

export const syncProducts = async (productsData: any[]) => {
  const createdProducts = [];
  
  for (const item of productsData) {
    const categoryName = item.tipo;
    let category = await prisma.category.findFirst({ where: { name: categoryName } });
    
    if (!category && categoryName) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    const productPrice = item.price ? Number(item.price) : 10.0;

    const product = await prisma.product.create({
      data: {
        name: item.name,
        price: productPrice,
        fruta: item.fruta,
        img: item.img,
        categoryId: category?.id,
      }
    });
    createdProducts.push(product);
  }
  
  return createdProducts;
};

export const updateProduct = async (id: number, data: any) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const affectedOrderItems = await tx.orderItem.findMany({
      where: { productId: id },
      select: { orderId: true },
    });

    const affectedOrderIds = [...new Set(affectedOrderItems.map((oi) => oi.orderId))];

    await tx.orderItem.deleteMany({
      where: { productId: id },
    });

    if (affectedOrderIds.length > 0) {
      const ordersWithItems = await tx.orderItem.findMany({
        where: { orderId: { in: affectedOrderIds } },
        select: { orderId: true },
      });
      const orderIdsWithItems = new Set(ordersWithItems.map((oi) => oi.orderId));
      const emptyOrderIds = affectedOrderIds.filter((oid) => !orderIdsWithItems.has(oid));

      if (emptyOrderIds.length > 0) {
        await tx.order.deleteMany({
          where: { id: { in: emptyOrderIds } },
        });
      }
    }

    return await tx.product.delete({
      where: { id },
    });
  });
};
