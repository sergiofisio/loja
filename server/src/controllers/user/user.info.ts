import axios from "axios";
import { Request, Response } from "express";
import { prisma } from "./user.register";

async function userInfo(req: Request, res: Response): Promise<any> {
  const { id } = req.params;

  try {
    const basicAuthorization = Buffer.from(
      `${process.env.SECRET_KEY}:`
    ).toString("base64");
    const options = {
      method: "GET",
      url: `https://api.pagar.me/core/v5/customers/${id}`,
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
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
      method: "GET",
      url: `https://api.pagar.me/core/v5/customers/${id}/addresses`,
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

    const { cart } = await prisma.user.findUnique({
      where: { id },
      include: { cart: true },
    });

    for (const order of cart) {
      const { status, charges, shipping } = await axios
        .request({
          method: "GET",
          url: `https://api.pagar.me/core/v5/orders/${order.idPagarme}`,
          headers: {
            accept: "application/json",
            authorization: "Basic c2tfdGVzdF9LZGE1WjE0c2ttVGxQd0JxOg==",
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });
      order.adress = shipping.address;
      order.transactionType = charges[0].payment_method;
      order.status = status;
    }

    res.json({ user: userInfo, adresses: adresses.data, orders: cart });
  } catch (error: any) {
    console.log(error);

    return res.status(error.status).json({ error: error.message });
  }
}

export default userInfo;
