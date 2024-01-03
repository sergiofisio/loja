import { Request, Response } from "express";
import { prisma } from "./../../prismaFunctions/prisma";
import axios from "axios";
async function allUsersInfo(_: Request, res: Response) {
  const allUsersInfo = [];
  const orders: any = [];
  let total = 0;

  let page = 1;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const users = await prisma.user.findMany();
    for (const user of users) {
      const userInfo = {
        admin: user.admin,
        user: {},
        adresses: [],
        orders: [],
      };

      const infoUser = await axios
        .request({
          method: "GET",
          url: `https://api.pagar.me/core/v5/customers/${user.id}`,
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });

      const adresses = await axios
        .request({
          method: "GET",
          url: `https://api.pagar.me/core/v5/customers/${user.id}/addresses`,
          params: { page: "1", size: "999" },
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });

      const { cart } = await prisma.user.findUnique({
        where: { id: user.id },
        include: { cart: true },
      });

      userInfo.user = infoUser;
      userInfo.adresses = adresses;
      userInfo.orders = cart;

      allUsersInfo.push(userInfo);
    }

    res.json({ users: allUsersInfo });
  } catch (error: any) {
    console.log({ error });

    res.status(500).json({ error });
  }
}

export default allUsersInfo;
