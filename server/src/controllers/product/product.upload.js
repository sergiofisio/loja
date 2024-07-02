const { prisma } = require("../../prismaFunctions/prisma");

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, stock, weight, image, category } = req.body;

  try {
    await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        promotionPrice: Number(price * 0.8),
        weight: Number(weight),
        image,
        categoryId: Number(category),
      },
    });

    return res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(error.status).json({ error: error.message });
  }
}

module.exports = updateProduct;
