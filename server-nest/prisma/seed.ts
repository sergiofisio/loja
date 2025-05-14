import { PrismaClient } from '@prisma/client';
import seedCategory from './seeds/seedCategory';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');
  await seedCategory(prisma);
  console.log('✅ Seed finalizado.');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
