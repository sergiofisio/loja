import { Request, Response } from "express";
import { CustomError } from './../../class/class';
import { findUnique } from '../../prismaFunctions/prisma';
const jwt = require('jsonwebtoken');

async function newToken(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    try {
        const findEmail = await findUnique('user', { email });
        if (!findEmail) throw new CustomError('Usuário não encontrado', 400)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ id: findEmail.id, token });
    } catch (error: any) {
        console.log(error);

        res.status(error.status).json({ error: error.message });

    }
}

export default newToken