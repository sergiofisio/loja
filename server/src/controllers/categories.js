const { prisma } = require("../prismaFunctions/prisma");


async function getCategories(_, res) {
    try {
        const categories = await prisma.category.findMany()

        return res.json({ categories })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = getCategories;