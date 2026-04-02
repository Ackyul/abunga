import 'dotenv/config';
import prisma from '../lib/prisma';

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Error: Debes proporcionar el correo electrónico del usuario que deseas volver ADMIN.');
    console.log('💡 Uso: npx ts-node src/scripts/make-admin.ts <correo>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌ Error: No se encontró ningún usuario con el correo: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`✅ ¡Éxito! El usuario ${email} ahora tiene permisos de ADMINISTRADOR.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
