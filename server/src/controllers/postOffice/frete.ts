import axios from "axios";
import { Request, Response } from "express";

export default async function frete(req: Request, res: Response) {
  let { cep } = req.params;
  let {
    amount,
    weight,
    document,
    name,
    email,
    phone,
    street,
    number,
    district,
    city,
    state,
  } = req.body;

  try {
    const data = JSON.stringify({
      origin: {
        name: "Green Life",
        company: "Green Life",
        email: "contato@greenlifesaude.com.br",
        phone: "11965932620",
        street: "Rua Municipal",
        number: "507",
        district: "Centro",
        city: "São Bernardo do Campo",
        state: "SP",
        country: "BR",
        postalCode: "09710-212",
      },
      destination: {
        name,
        email,
        phone,
        street,
        number,
        district,
        city,
        state,
        country: "BR",
        postalCode: cep,
      },
      packages: [
        {
          content: `Produtos de ${name}`,
          amount: 1,
          type: "box",
          weight,
          insurance: amount,
          declaredValue: amount,
          weightUnit: "KG",
          lengthUnit: "CM",
          dimensions: {
            length: 11,
            width: 16,
            height: 10,
          },
        },
      ],
      shipment: {
        carrier: "correios",
        type: 1,
      },
      settings: {
        currency: "BRL",
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.ENVIA_URL}/ship/rate/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ENVIA_TOKEN}`,
      },
      data: data,
    };
    await axios(config)
      .then(function (response) {
        return res.json({ fretes: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ error: "Erro interno" });
  }
}
