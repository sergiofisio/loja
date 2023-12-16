import { Request, Response } from "express";
import { findUnique, prisma } from './../../prismaFunctions/prisma';


async function allProductsList(_: Request, res: Response): Promise<any> {
    const allProducts: Array<any> = [];
    try {
        const findAllProducts = await prisma.product.findMany();

        for (const product of findAllProducts) {
            const productInfo = await findUnique('product', {
                id: Number(product.id)
            })

            allProducts.push(productInfo)
        }
        return res.json({ allProducts })
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default allProductsList