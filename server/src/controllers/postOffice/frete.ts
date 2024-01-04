import axios from "axios";
import { Request, Response } from "express";

export default async function frete(req: Request, res: Response) {
  let { cep } = req.params;
  cep = cep.replace("-", "");

  try {
    const frete = await axios
      .request({
        method: "POST",
        url: `${process.env.MELHOR_URL}/shipment/calculate`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life greenlifebiointegral@gmail.com)",
        },
        data: {
          from: { postal_code: "09710212" },
          to: { postal_code: cep },
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });

    res.json({ frete });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Erro interno" });
  }
}
