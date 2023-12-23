import { Request, Response } from "express";
import axios from "axios";

export default async function getOrder(req: Request, res: Response) {
    const { customer_id } = req.body;

    const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString('base64');

    try {
        const options = {
            method: "GET",
            url: `${process.env.BASE_URL}/orders`,
            params: { customer_id },
            headers: {
                accept: "application/json",
                authorization: `${basicAuthorization}`,
            },
        };

        return axios
            .request(options)
            .then(function (response: any) {
                return res.status(200).json({ order: response.data });
            })
            .catch(function (error) {
                res.status(400).json(error.response.data.errors);
            });
    } catch (error: any) {
        console.log(error);

        res.status(400).json(error.response.data.errors);
    }
};