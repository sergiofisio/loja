import axios from "axios";
import { Request, Response } from "express";


export async function verifyOrder(req: Request, res: Response) {
    const { order_id } = req.params;

    const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString('base64');

    try {
        const options = {
            method: "GET",
            url: `${process.env.BASE_URL}/orders/${order_id}`,
            headers: {
                accept: "application/json",
                authorization: basicAuthorization,
            },
        };

        const order = await axios
            .request(options)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(function (error) {
                res.status(400).json(error);
            });
        console.log({ order });
    } catch (error: any) {
        console.log(error);

    }

}