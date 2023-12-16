import { findUnique } from "../../prismaFunctions/prisma";
import { Request, Response } from "express";

async function verify(req: Request, res: Response) {
    try {
        const data = req.body;


        const verifyInput = await findUnique('user', { [data.input]: data.value });

        if (verifyInput)
            return res.json(true);
        return res.json(false)
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });

    }
}

export default verify