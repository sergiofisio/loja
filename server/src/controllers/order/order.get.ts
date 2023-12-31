import { Request, Response } from "express";
import axios from "axios";

export async function getOrder(req: Request, res: Response) {
  const { customer_id } = req.body;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const options = {
      method: "GET",
      url: `${process.env.BASE_URL}/orders`,
      params: { customer_id },
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
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
}

export async function getAllOrders(req: Request, res: Response) {
  const { customer_id } = req.params;
  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  console.log({ customer_id });

  const orders: any = [];
  let total = 0;

  let page = 1;

  try {
    const options = {
      method: "GET",
      url: `${process.env.BASE_URL}/orders`,
      params: { customer_id, page, size: "30" },
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
    };

    await axios
      .request(options)
      .then(function (response: any) {
        total = response.data.paging.total;
      })
      .catch(function (error) {
        res.status(400).json(error.response.data.errors);
      });

    console.log({ total });

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
          for (const order of response.data.data) {
            orders.push(order);
          }
        })
        .catch(function (error) {
          return res.status(400).json(error.response);
        });
    }
    return res.json(orders);
  } catch (error: any) {
    return res.status(400).json(error.response);
  }
}
