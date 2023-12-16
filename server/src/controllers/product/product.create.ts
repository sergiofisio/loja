import { Request, Response } from "express";
import { CustomError } from './../../class/class';
import { createOrUpdate, findFirst, findUnique } from '../../prismaFunctions/prisma';

async function createProduct(req: Request, res: Response) {
    const { name, description, price, promotionPrice, weight, image, category } = req.body;

    console.log({ name, description, price, promotionPrice, weight, image, category });


    try {

        const findProduct = await findFirst('product', {
            name
        })

        if (findProduct) {
            throw new CustomError("Produto já cadastrado", 400)
        }

        const { id } = await createOrUpdate('product', { name, description, price: Number(price), promotionPrice: Number(price * 0.8), weight: Number(weight), image, categoryId: Number(category) });

        const product = await findUnique('product', { id: Number(id) });

        return res.status(201).json({ product });
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default createProduct;