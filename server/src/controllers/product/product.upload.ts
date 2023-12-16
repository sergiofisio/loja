import { prisma } from "./../../prismaFunctions/prisma";
import { Request, Response } from "express";


async function updateProduct(req: Request, res: Response) {
    const { id } = req.params
    const { name, description, price, promotionPrice, weight, image, category } = req.body;

    try {
        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data: {
                name, description, price: Number(price), promotionPrice: Number(price * 0.8), weight: Number(weight), image, categoryId: Number(category)
            }
        })

        return res.status(200).json({ message: 'Produto atualizado com sucesso' });
    } catch (error: any) {
        console.log(error);
        return res.status(error.status).json({ error: error.message });
    }
}

export default updateProduct