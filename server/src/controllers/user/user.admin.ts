import { Request, Response } from "express";
import { findUnique } from '../../prismaFunctions/prisma';
import { CustomError } from './../../class/class';

async function userAdmin(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const userInfo = await findUnique('user', { id });
        if (!userInfo) throw new CustomError('Usuário não encontrado', 403);

        return res.json({ user: userInfo.admin });
    } catch (error: any) {
        return res.status(error.status).json({ error: error.message });
    }
}

export default userAdmin