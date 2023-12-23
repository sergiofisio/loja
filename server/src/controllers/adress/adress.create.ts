import axios from "axios";
import { Request, Response } from "express";


export default async function createAdress(req: Request, res: Response) {
    const { id } = req.params;
    const { line_1, zip_code, line_2, city, state, country } = req.body;

    console.log({ id, line_1, zip_code, line_2, city, state, country });


    try {
        const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString('base64');
        const options = {
            method: 'POST',
            url: `https://api.pagar.me/core/v5/customers/${id}/addresses`,
            headers: {
                accept: 'application/json',
                authorization: `Basic ${basicAuthorization}`
            },
            data: {
                line_1,
                line_2,
                zip_code,
                city,
                state,
                country
            }
        };

        const adress = await axios
            .request(options)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });

        return res.status(200).json(adress);
    } catch (error: any) {
        return res.status(400).json({ error });
    }
}