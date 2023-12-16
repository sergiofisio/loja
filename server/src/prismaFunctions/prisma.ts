const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient();

class includes {
  id?: number;
  email?: string;
  cpf?: string;
  adress?: boolean;
  cart?: boolean;
  admin?: boolean;
  where?: any
  images?: boolean
  colors?: boolean
}

export async function findUnique(
  table: string,
  data?: any,
  includes?: includes
) {

  try {
    const where = data;
    const Infos = await prisma[table].findUnique({
      where,
      include: includes ? includes : undefined,
    });
    return Infos;
  } catch (findUniqueError: any) {
    console.log({ findUniqueError });

  }
}

export async function findMany(table: string, includes?: includes) {

  const Infos = await prisma[table].findMany({
    include: includes ? includes : undefined,
  });
  return Infos;
}

export async function createOrUpdate(table: string, data: any, id?: number | string) {


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

export async function deleteOne(table: string, id: string) {

  return await prisma[table].delete({
    where: { id },
  });
}

export async function findFirst(table: string, data: any) {

  const Infos = await prisma[table].findFirst({
    where: data
  })

  return Infos;
}