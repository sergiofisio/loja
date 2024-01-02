import { Request, Response } from "express";
import { prisma } from "./user.register";
import bcrypt from "bcrypt";
import { CustomError } from "../../class/class";
import axios from "axios";

export default async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  let { name, email, document, phone, password } = req.body;

  phone = phone.replace(/\D/g, "");

  console.log(phone);

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );
  try {
    const options = {
      method: "PUT",
      url: `${process.env.BASE_URL}/customers/${id}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
      data: {
        email: email,
        name: name,
        document_type: "CPF",
        document: Number(document),
        type: "individual",
        phones: {
          mobile_phone: {
            country_code: phone.slice(0, 2),
            area_code: phone.slice(2, 4),
            number: phone.slice(4),
          },
        },
      },
    };

    if (password) {
      password = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id },
        data: { password },
      });
    }

    await axios
      .request(options)
      .then(function (response: any) {
        return response.data;
      })
      .catch(function (error: any) {
        console.log({ error: error.response.data.errors });

        throw new CustomError(error.response.data.errors, 400);
      });

    res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error: any) {
    console.log({ errorCatch: error });

    res.status(error.status).json({ message: error.message });
  }
}
