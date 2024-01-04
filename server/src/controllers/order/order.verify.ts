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

    if (!order.closed) {
      const findOrder = await prisma.cart.findFirst({
        where: {
          idPagarme: order_id,
        },
      });
      await prisma.cart.delete({ where: { id: findOrder.id } });
    }
    res.json({ order });
  } catch (error: any) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
}
