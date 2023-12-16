const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedCategory() {
  const existingStatuses = await prisma.category.findMany();
  const statusesToCreate = [
    { name: "Suplemento" },
    { name: "Floral" },
    { name: "Livro" },
    { name: "Incenso" },
  ].filter(
    (status) => !existingStatuses.some((s) => s.status === status.status)
  );

  if (statusesToCreate.length > 0) {
    await prisma.category.createMany({
      data: statusesToCreate,
    });
  }
}

module.exports = seedCategory;
