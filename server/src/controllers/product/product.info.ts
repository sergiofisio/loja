import { Request, Response } from "express";
import { findUnique } from '../../prismaFunctions/prisma';
import { CustomError } from "../../class/class";

async function productInfo(req: Request, res: Response) {
    const { productId } = req.params;

    try {
        const findProduct = await findUnique('product', {
            id: Number(productId)
        })
        if (!findProduct) {
            throw new CustomError("Produto não encontrado", 404);
        }

        return res.json(findProduct);
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default productInfo