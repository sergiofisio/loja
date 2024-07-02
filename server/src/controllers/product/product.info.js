const { findUnique } = require("../../prismaFunctions/prisma");
const { CustomError } = require("../../class/class");

async function productInfo(req, res) {
  const { productId } = req.params;

  try {
    const findProduct = await findUnique("product", {
      id: Number(productId),
    });
    if (!findProduct) {
      throw new CustomError("Produto não encontrado", 404);
    }

    return res.json(findProduct);
  } catch (error) {
    console.error(error);

    return res.status(error.status).json({ error: error.message });
  }
}

module.exports = productInfo;
