const { CustomError } = require("../../class/class");
const {
  createOrUpdate,
  findFirst,
  findUnique,
  prisma,
} = require("../../prismaFunctions/prisma");

async function createProduct(req, res) {
  const { name, description, price, stock, weight, image, category } = req.body;

  try {
    const findProduct = await findFirst("product", {
      name,
    });

    if (findProduct) {
      throw new CustomError("Produto já cadastrado", 400);
    }

    const categoryExists = await findUnique("category", {
      id: Number(category),
    });

    if (!categoryExists) {
      throw new CustomError("Categoria não encontrada", 400);
    }

    await prisma.product.create({
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

    return res.status(201).json({ message: "Product created" });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = createProduct;
