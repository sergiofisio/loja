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

      const options = {
        method: "GET",
        url: `https://api.pagar.me/core/v5/customers/${user.id}`,
        headers: {
          accept: "application/json",
          authorization: `Basic ${basicAuthorization}`,
        },
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
        method: "GET",
        url: `https://api.pagar.me/core/v5/customers/${user.id}/addresses`,
        params: { page: "1", size: "999" },
        headers: {
          accept: "application/json",
          authorization: `Basic ${basicAuthorization}`,
        },
      };

      const adresses = await axios
        .request(options2)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });

      const getTotal = {
        method: "GET",
        url: `${process.env.BASE_URL}/orders`,
        params: { customer_id: user.id, page, size: "30" },
        headers: {
          accept: "application/json",
          authorization: `Basic ${basicAuthorization}`,
        },
      };

      await axios
        .request(getTotal)
        .then(function (response: any) {
          total = response.data.paging.total;
        })
        .catch(function (error) {
          throw new Error(error.response.data.errors);
        });

      page = Math.ceil(total / 30);

      for (let i = 1; i <= page; i++) {
        const options = {
          method: "GET",
          url: `${process.env.BASE_URL}/orders`,
          params: { page: String(i), size: "30" },
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        };

        await axios
          .request(options)
          .then(function (response: any) {
            const ordersFiltered = response.data.data.filter(
              (order: any) => order.customer.id === user.id
            );
            for (let order of ordersFiltered) {
              orders.push(order);
            }
          })
          .catch(function (error) {
            throw new Error(error.response);
          });
      }
      userInfo.user = infoUser;
      userInfo.adresses = adresses;
      userInfo.orders = orders;

      allUsersInfo.push(userInfo);
    }

    res.json({ users: allUsersInfo });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ error });
  }
}

export default allUsersInfo;
