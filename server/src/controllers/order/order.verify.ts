import axios from "axios";
import { Request, Response } from "express";
import { prisma } from "../../prismaFunctions/prisma";

export async function verifyOrder(req: Request, res: Response) {
  const { order_id } = req.params;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const options = {
      method: "GET",
      url: `${process.env.BASE_URL}/orders/${order_id}`,
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
    };

    const order = await axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new Error(error);
      });

    const findOrder = await prisma.cart.findFirst({
      where: {
        idPagarme: order_id,
      },
    });

    if (!order.closed) {
      await prisma.cart.delete({ where: { id: findOrder.id } });
    }
    for (const product of JSON.parse(findOrder.products)) {
      const { stock } = await prisma.product.findUnique({
        where: { id: Number(product.code) },
      });
      if (order.status === "paid") {
        await prisma.product.update({
          where: { id: Number(product.code) },
          data: { stock: Number(stock - product.quantity) },
        });
      }
    }
    res.json({ order });
  } catch (error: any) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
}
