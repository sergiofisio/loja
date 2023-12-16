import { prisma } from "./../prismaFunctions/prisma";
import { Request, Response } from "express";


async function getCategories(_: Request, res: Response) {
    try {
        const categories = await prisma.category.findMany()

        return res.json({ categories })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

export default getCategories