const { findUnique, prisma } = require("../../prismaFunctions/prisma");

async function allProductsList(_, res) {
  const allProducts = [];
  try {
    const findAllProducts = await prisma.product.findMany();

    for (const product of findAllProducts) {
      const productInfo = await findUnique("product", {
        id: Number(product.id),
      });

      allProducts.push(productInfo);
    }
    return res.json({ allProducts });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = allProductsList;
