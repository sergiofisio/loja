const { CustomError } = require("../../class/class");
const {
  createOrUpdate,
  findFirst,
  findUnique,
} = require("../../prismaFunctions/prisma");

async function createProduct(req, res) {
  const {
    name,
    description,
    price,
    stock,
    promotionPrice,
    weight,
    image,
    category,
  } = req.body;

  try {
    const findProduct = await findFirst("product", {
      name,
    });

    if (findProduct) {
      throw new CustomError("Produto já cadastrado", 400);
    }

    const { id } = await createOrUpdate("product", {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      promotionPrice: Number(price * 0.8),
      weight: Number(weight),
      image,
      categoryId: Number(category),
    });

    const product = await findUnique("product", { id: Number(id) });

    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = createProduct;
