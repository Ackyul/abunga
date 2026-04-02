import prisma from '../lib/prisma';

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const createCategory = async (data: { name: string; description?: string }) => {
  return await prisma.category.create({
    data,
  });
};

export const deleteCategory = async (id: number) => {
  return await prisma.category.delete({
    where: { id },
  });
};
