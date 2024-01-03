import { CustomError } from "./../../class/class";
import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../user/user.register";

// : [
//           { name: "quantum blend", quantity: "1", unitary_value: "69,90" },
//           { name: "quantum moro", quantity: "1", unitary_value: "69,90" },
//         ]

export default async function ticket(req: Request, res: Response) {
  const {
    id,
    name,
    phone,
    email,
    document,
    address,
    number,
    complement,
    district,
    city,
    country,
    zip_code,
    state,
    insurance_value,
    products,
    weight,
    service,
  } = req.body;

  console.log(id);

  try {
    const productsInfo = [];

    for (const product of products) {
      productsInfo.push({
        name: product.description,
        quantity: product.quantity,
        unitary_value: product.amount / 100,
      });
    }

    const gerateTicket = await axios
      .request({
        method: "POST",
        url: `${process.env.MELHOR_URL}/cart`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life (contato@greenlifesaude.com.br)",
        },
        data: {
          from: {
            name: "Green Life",
            phone: "+55 11 96593-2620",
            email: "contato@greenlifegreenlifesaude.com.br",
            company_document: "52.257.511/0001-97",
            state_register: "799.775.920.110",
            address: "Rua Municipal",
            complement: "apto 102",
            number: "507",
            district: "Centro",
            city: "São Bernardo do Campo",
            country_id: "BR",
            postal_code: "09710212",
            state_abbr: "SP",
          },
          to: {
            name,
            phone: `${phone.slice(0, 2)} ${phone.slice(2, 4)} ${phone.slice(
              4,
              9
            )}-${phone.slice(9)}`,
            email,
            document,
            address,
            number,
            complement,
            district,
            city,
            country_id: country,
            postal_code: zip_code,
            state_abbr: state,
          },
          options: {
            receipt: false,
            own_hand: false,
            reverse: false,
            non_commercial: true,
            insurance_value,
          },
          service: service === "PAC" ? 1 : 2,
          products: productsInfo,
          volumes: [{ height: 11, width: 11, length: 16, weight }],
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);

        throw new Error(error);
      });

    await axios
      .request({
        method: "POST",
        url: `${process.env.MELHOR_URL}/shipment/checkout`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life (contato@greenlifesaude.com.br)",
        },
        data: { orders: [gerateTicket.id] },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);

        throw new Error(error);
      });

    const url = await axios
      .request({
        method: "POST",
        url: `${process.env.MELHOR_URL}/shipment/preview`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life (contato@greenlifesaude.com.br)",
        },
        data: { orders: [gerateTicket.id] },
      })
      .then(function (response) {
        return response.data.url;
      })
      .catch(function (error) {
        console.error(error);
        throw new Error(error);
      });

    console.log(url);

    await prisma.cart.update({
      where: { id },
      data: { ticketUrl: url },
    });

    res.json({ url });
  } catch (error) {
    console.log(error);

    res.json({ error: "erro interno" });
  }
}
