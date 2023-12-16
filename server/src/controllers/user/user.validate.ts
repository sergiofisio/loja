import { Request, Response } from "express";
import { findUnique, prisma } from './../../prismaFunctions/prisma';
import { CustomError } from './../../class/class';
const jwt = require('jsonwebtoken');

async function validateEmail(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const user = await findUnique('user', { id });

    try {

        if (user.validated) {
            res.json({ message: 'Email já validado' })
            await prisma.user.update({ where: { id: user.id }, data: { validateToken: '' } });
            return
        };

        const validateToken = jwt.verify(user.validateToken, process.env.JWT_SECRET);

        if (!validateToken) throw new CustomError('Token inválido', 400);

        await prisma.user.update({ where: { id: user.id }, data: { validateToken: '', validated: true } });

        res.json({ email: user.email, message: 'Email validado com sucesso!' });

    } catch (error: any) {
        if (error.message)
            return res.status(error.status || 400).json({ email: user.email, error: error.message === 'jwt expired' || error.message === 'jwt malformed' || error.message === 'invalid signature' || error.message === 'invalid token' ? 'Sua conta não pode ser validada' : error.message });
    }
}

export default validateEmail