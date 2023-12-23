import { Request, Response } from "express";
import { prisma } from './user.register';
import bcrypt from 'bcrypt';
import { CustomError } from '../../class/class';


export default async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    try {
        const options: { name: string; email: string; document: string; password?: string } = {
            name: data.name,
            email: data.email,
            document: data.document,
        }

        const findEmail = await prisma.user.findUnique({ where: { email: data.email } })

        if ((findEmail && findEmail.id !== id)) {
            throw new CustomError("Email ja existe no cadastro", 4001)
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 8)
            options.password = data.password
        }

        const user = await prisma.user.update({
            where: { id },
            data: options
        })

        res.status(200).json({ user })

    } catch (error: any) {

        res.status(error.status).json({ message: error.message })
    }
}