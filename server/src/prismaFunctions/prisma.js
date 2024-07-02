const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function findUnique(table, data, includes) {
  try {
    const where = data;
    const Infos = await prisma[table].findUnique({
      where,
      include: includes ? includes : undefined,
    });
    return Infos;
  } catch (findUniqueError) {
    console.error({ findUniqueError });
  }
}

async function findMany(table, includes) {
  const Infos = await prisma[table].findMany({
    include: includes ? includes : undefined,
  });
  return Infos;
}

async function createOrUpdate(table, data, id) {
  if (id) {
    return await prisma[table].update({
      where: { id: Number(id) },
      data: { ...data },
    });
  }

  return await prisma[table].create({
    data,
  });
}

async function deleteOne(table, id) {
  return await prisma[table].delete({
    where: { id },
  });
}

async function findFirst(table, data) {
  const Infos = await prisma[table].findFirst({
    where: data,
  });

  return Infos;
}

module.exports = {
  prisma,
  findUnique,
  findMany,
  createOrUpdate,
  deleteOne,
  findFirst,
};
