const { PrismaClient } = require("@prisma/client");
const products = require("../data/products");

const prisma = new PrismaClient();

async function seedProducts() {
  const existingProducts = await prisma.product.findMany();
  const productToCreate = products.filter(
    (product) => !existingProducts.some((s) => s.name === product.name)
  );

  if (productToCreate.length > 0) {
    for (const product of productToCreate) {
      await prisma.product.create({
        data: product,
      });
    }
  }
}

module.exports = seedProducts;
