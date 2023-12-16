import { findMany } from "../prismaFunctions/prisma";
import { Request, Response } from "express";

const infoHome = async (req: Request, res: Response) => {
    const { table } = req.params;

    let include = {}
    switch (table) {
        case 'product':
            include = {
                images: true,
            }
            break;
        case 'partner':
            include = {
                cart: true
            }
            break;
    }
    try {

        const info = await findMany(table,
            include
        )

        res.json({ info })

    } catch (error: any) {
        console.log(error);

    }
};

export default infoHome;