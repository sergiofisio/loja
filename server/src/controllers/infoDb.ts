import { findMany } from "../prismaFunctions/prisma";
import { Request, Response } from "express";

const infoDb = async (_: Request, res: Response) => {
    try {
        const products = await findMany('product');
        const users = await findMany('user', {
            adress: true,
            cart: true,
        });
        const testimonials = await findMany('testimonial');
        const partners = await findMany('partner', {
            cart: true,
        });

        res.json({ products, users, testimonials, partners })
    } catch (error: any) {

    }
}

export default infoDb