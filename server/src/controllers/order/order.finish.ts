import { prisma } from "../../prismaFunctions/prisma";
import axios from "axios";
import { Request, Response } from "express";

export async function finishOrder(req: Request, res: Response) {
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
        return error;
      });

    const findOrder = await prisma.cart.findFirst({
      where: {
        idPagarme: order_id,
      },
    });
    if (order.status === "paid") {
      await prisma.cart.update({
        where: { id: findOrder.id },
        data: { finished: true },
      });
    }
    res.send("ok");
  } catch (error: any) {
    console.log(error);
  }
}
