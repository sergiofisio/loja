import axios from "axios";
import { Request, Response } from "express";
import { prisma } from "./../../prismaFunctions/prisma";

export default async function createOrder(req: Request, res: Response) {
  const { userId } = req.params;
  const {
    address_id,
    line_1,
    line_2,
    state,
    city,
    zip_code,
    items,
    recipient_name,
    recipient_phone,
    email,
    frete,
    amount,
    description,
    data,
    compra,
    cupom,
    id_parceiro,
    parceiro,
  } = req.body;
  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const products = [];
    for (const item in items) {
      console.log(items[item]);

      products.push({
        amount: items[item].product.preco,
        description: items[item].product.nome,
        quantity: items[item].quantidade,
        code: items[item].product.id,
      });
    }
    const options = {
      method: "POST",
      url: `${process.env.BASE_URL}/orders`,
      headers: {
        accept: "application/json",
        authorization: `${basicAuthorization}`,
      },
      data: {
        items: products,
        customer: {
          name: recipient_name,
          email,
        },
        shipping: {
          address: {
            country: "BR",
            state,
            city,
            zip_code,
            line_1,
            line_2,
          },
          amount: frete,
          description,
          recipient_name,
          recipient_phone,
        },
        payments: [
          {
            payment_method: "checkout",
            amount,
            expires_in: 30,
            default_payment_method: "pix",
            checkout: {
              skip_checkout_success_page: true,
              customer_editable: false,
              billing_address_editable: false,
              accepted_payment_methods: ["credit_card", "pix", "boleto"],
              credit_card: {
                capture: true,
                statement_descriptor: "Green Life",
                installments: [
                  {
                    number: 1,
                    total: amount,
                  },
                  {
                    number: 2,
                    total: amount,
                  },
                  {
                    number: 3,
                    total: amount,
                  },
                  {
                    number: 4,
                    total: amount,
                  },
                  {
                    number: 5,
                    total: amount,
                  },
                  {
                    number: 6,
                    total: Math.round(amount * 1.123),
                  },
                  {
                    number: 7,
                    total: Math.round(amount * 1.135),
                  },
                  {
                    number: 8,
                    total: Math.round(amount * 1.148),
                  },
                  {
                    number: 9,
                    total: Math.round(amount * 1.161),
                  },
                  {
                    number: 10,
                    total: Math.round(amount * 1.173),
                  },
                ],
              },

              pix: {
                expires_in: 120,
              },
            },
            billing_address: {
              line_1,
              line_2,
              zip_code,
              city,
              state,
              country: "BR",
            },
          },
        ],
        code: description,
        customer_id: userId,
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

    console.log({ order });

    const cart = await prisma.cart.create({
      data: {
        userId,
        idPagarme: order.id,
        products: JSON.stringify(products),
        date: new Date(),
        partnerId: id_parceiro,
      },
    });
    res.json({ order, cart });
  } catch (error: any) {
    console.log(error);
  }
}
