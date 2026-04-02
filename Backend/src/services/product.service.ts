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
  // If editing category ID based on external input, ensure it is passed correctly.
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return await prisma.product.delete({
    where: { id },
  });
};
