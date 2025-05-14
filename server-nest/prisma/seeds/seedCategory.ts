import { PrismaClient } from '@prisma/client';

export default async function seedCategory(prisma: PrismaClient) {
  const existing = await prisma.category.findMany({ select: { name: true } });

  const categories = [
    { name: 'Suplemento' },
    { name: 'Floral' },
    { name: 'Livro' },
    { name: 'Incenso' },
  ];

  const toCreate = categories.filter(
    (c) => !existing.some((e) => e.name === c.name),
  );

  if (toCreate.length > 0) {
    await prisma.category.createMany({ data: toCreate });
    console.log('Categorias criadas com sucesso.');
  } else {
    console.log('Categorias já existentes.');
  }
}
