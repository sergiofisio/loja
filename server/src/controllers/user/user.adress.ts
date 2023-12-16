import axios from "axios";
import { Request, Response } from "express";
import { CustomError } from './../../class/class';
import { prisma } from './../../prismaFunctions/prisma';


async function registerAdress(req: Request, res: Response) {
    try {
        const { street, number, complement, district, city, state, zip_code } = req.body;

        const { user } = req;

        const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString('base64');

        const options = {
            method: "POST",
            url: `${process.env.BASE_URL}/customers/${user?.id}/addresses`,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Basic ${basicAuthorization}`,
            },
            data: {
                line_1: `${number}, ${street}, ${district}`,
                line_2: complement,
                city,
                state,
                country: "BR",
                zip_code: zip_code,
            }
        }

        const adress = await axios
            .request(options)
            .then(function (response: any) {
                return response.data
            })
            .catch(function (error: any) {
                console.log(error.response.data.errors);

                throw new CustomError(error.response.data.errors, 401)
            });

        await prisma.adress.create({
            id: adress.id,
            userId: user?.id,
        })

        return res.json({ message: 'Endereço criado com sucesso!' });
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default registerAdress