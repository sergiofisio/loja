import { CustomError } from "./../../class/class";
import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../user/user.register";

// : [
//           { name: "quantum blend", quantity: "1", unitary_value: "69,90" },
//           { name: "quantum moro", quantity: "1", unitary_value: "69,90" },
//         ]

export default async function ticket(req: Request, res: Response) {
  let {
    name,
    phone,
    email,
    document,
    amount,
    street,
    number,
    district,
    city,
    zip_code,
    state,
    weight,
    service,
  } = req.body;

  zip_code = zip_code.replace("-", "");
  document = document.replace(".", "").replace(".", "").replace("-", "");

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
      postalCode: zip_code,
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
      service,
      type: 1,
    },
    settings: {
      printFormat: "PDF",
      printSize: "STOCK_4X6",
    },
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.envia.com/ship/generate/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ENVIA_TOKEN}`,
    },
    data: data,
  };
  await axios(config)
    .then(function (response) {
      console.log(response.data);

      // return res.json({ fretes: response.data.data });
    })
    .catch(function (error) {
      console.log(error);
    });

  try {
  } catch (error: any) {
    console.log(error.response.data);

    res.json({ error: "erro interno" });
  }
}
