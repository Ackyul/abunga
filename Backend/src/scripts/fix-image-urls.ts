import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function fixImageUrls() {
  const oldBase = 'http://localhost:3000';
  const newBase = 'http://16.59.39.194:3001';

  const products = await prisma.product.findMany({
    where: { img: { contains: oldBase } },
  });

  console.log(`Found ${products.length} products with localhost URLs`);

  for (const product of products) {
    const newImg = product.img!.replace(oldBase, newBase);
    await prisma.product.update({
      where: { id: product.id },
      data: { img: newImg },
    });
    console.log(`✅ Updated: ${product.name} → ${newImg}`);
  }

  console.log('Done!');
  await prisma.$disconnect();
}

fixImageUrls().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
