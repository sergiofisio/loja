import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient();

const nodemailer = require('nodemailer');

async function sendEmail(req: Request, res: Response): Promise<any> {

    const { mail, id, token } = req.body;

    await prisma.user.update({
        where: { id }, data: { validateToken: token }
    })

    const url = req.get('origin') + "/validateEmail" + "/" + id + "/" + token;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from: 'Green Life',
        to: mail,
        subject: 'Pedido de recuperação de senha',
        html: `Clique <a href="${url}">aqui</a> para terminar o seu cadastro`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return console.log(error);
        }
        res.json({ mensagem: 'Email enviado com sucesso!' })
    });

}

export default sendEmail