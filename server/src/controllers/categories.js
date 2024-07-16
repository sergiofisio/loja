const { prisma } = require("../prismaFunctions/prisma");

async function getCategories(_, res) {
  try {
    const categories = await prisma.category.findMany();

    return res.json({ categories });
  } catch (error) {
    await prisma.log.create({
      data: {
        message: error.message,
        path: "categories",
      },
    });
    return res.status(500).json({ error: error.message });
  }
}

module.exports = getCategories;
