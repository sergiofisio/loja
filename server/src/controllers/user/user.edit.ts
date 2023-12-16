import { Request, Response } from 'express';
const axios = require('axios');
import { prisma } from '../../prismaFunctions/prisma';
import bcrypt from 'bcrypt';
import { CustomError } from './../../class/class';

async function editUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    let { name, email, document, phone, birthdate, password } = req.body;

    const basicAuthorization = Buffer.from(`${process.env.SECRET_PP}:`).toString('base64');

    try {
        const options = {
            method: "PUT",
            url: `${process.env.BASE_URL_PAGARME}/customers/${id}`,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Basic ${basicAuthorization}`,
            },
            data: {
                email: email,
                name: name,
                document_type: "CPF",
                document: Number(document),
                type: 'individual',
                phones: { mobile_phone: { country_code: phone.slice(0, 2), area_code: phone.slice(2, 4), number: phone.slice(4) } },
                birthdate: new Date(birthdate),
            }
        }

        if (password) {
            password = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id },
                data: { password },
            });
        }

        await axios
            .request(options)
            .then(function (response: any) {
                return response.data
            })
            .catch(function (error: any) {
                throw new CustomError(error.response.data.errors, 400)
            });


        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
    } catch (error: any) {
        console.log(error);

        return res.status(500).json({ error: error.message });
    }
}

export default editUser