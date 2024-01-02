import axios from "axios";
import { Request, Response } from "express";

export default async function deleteAdresses(req: Request, res: Response) {
  const { id } = req.params;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const options = {
      method: "GET",
      url: `https://api.pagar.me/core/v5/customers/${id}/addresses`,
      params: { page: "1", size: "999" },
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
    };

    const addresses = await axios.request(options).then(function (response) {
      return response.data.data;
    });

    for (const address of addresses) {
      axios
        .request({
          method: "DELETE",
          url: `https://api.pagar.me/core/v5/customers/${id}/addresses/${address.id}`,
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });
    }

    res.json({ ok: true });
  } catch (error: any) {
    console.log(error);
  }
}
