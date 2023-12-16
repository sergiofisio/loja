import { Request, Response } from 'express';
import { prisma } from './../../prismaFunctions/prisma';
import axios from "axios";
async function allUsersInfo(_: Request, res: Response) {
    const allUsersInfo = []
    try {
        const users = await prisma.user.findMany();
        for (const user of users) {

            const userInfo = {
                admin: user.admin,
                user: {},
                adresses: []
            }

            const basicAuthorization = Buffer.from(`${process.env.SECRET_PP}:`).toString('base64');
            const options = {
                method: 'GET',
                url: `https://api.pagar.me/core/v5/customers/${user.id}`,
                headers: {
                    accept: 'application/json',
                    authorization: `Basic ${basicAuthorization}`
                }
            };

            const infoUser = await axios
                .request(options)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    return error;
                });

            const options2 = {
                method: 'GET',
                url: `https://api.pagar.me/core/v5/customers/${user.id}/addresses`,
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
            userInfo.user = infoUser;
            userInfo.adresses = adresses

            allUsersInfo.push(userInfo)
        }


        res.json({ users: allUsersInfo })
    } catch (error: any) {
        console.log(error);

        res.status(500).json({ error })
    }
}

export default allUsersInfo