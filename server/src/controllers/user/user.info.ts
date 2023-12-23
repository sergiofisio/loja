import axios from "axios";
import { Request, Response } from "express";

async function userInfo(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    try {
        const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString('base64');
        const options = {
            method: 'GET',
            url: `https://api.pagar.me/core/v5/customers/${id}`,
            headers: {
                accept: 'application/json',
                authorization: `Basic ${basicAuthorization}`
            }
        };

        const userInfo = await axios
            .request(options)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });

        delete userInfo.address;

        const options2 = {
            method: 'GET',
            url: `https://api.pagar.me/core/v5/customers/${id}/addresses`,
            params: { page: '1', size: '999' },
            headers: {
                accept: 'application/json',
                authorization: `Basic ${basicAuthorization}`
            }
        };

        const adresses = await axios
            .request(options2)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });

        const options3 = {
            method: 'GET',
            url: 'https://api.pagar.me/core/v5/orders',
            params: { customer_id: id, page: '1', size: '999' },
            headers: {
                accept: 'application/json',
                authorization: `Basic ${basicAuthorization}`
            }
        }
        const orders = await axios
            .request(options3)
            .then(function (response) {
                return (response.data);
            })
            .catch(function (error) {
                return (error);
            });
        res.json({ user: userInfo, adresses: adresses.data, orders: orders });
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default userInfo