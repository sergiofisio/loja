const axios = require("axios");
const bcrypt = require("bcrypt");
const { CustomError } = require("../../class/class");
const { findUnique } = require("../../prismaFunctions/prisma");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function register(req, res) {
  try {
    let { name, email, document, phone, password } = req.body;

    password = await bcrypt.hash(password, 10);

    phone = phone.replace(/\D/g, "");

    const basicAuthorization = Buffer.from(
      `${process.env.SECRET_KEY}:`
    ).toString("base64");

    const options = {
      method: "POST",
      url: `${process.env.BASE_URL}/customers`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
      data: {
        email: email,
        name: name,
        document_type: "CPF",
        document: Number(document.replace(/[.-]/g, "")),
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

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new CustomError("Erro interno do sistema.", 500);
    }

    const userInfo = await axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error.response.data.errors);

        return error.response.data.errors;
      });

    const findUser = await findUnique("user", { id: userInfo.id });

    if (findUser) {
      throw new CustomError("Usuário ja cadastrado", 400);
    }

    await prisma.user.create({
      data: {
        id: userInfo.id,
        name,
        email,
        document: document.replace(/[.-]/g, ""),
        password,
      },
    });

    return res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    if (error.missingInput)
      return res
        .status(error.status)
        .json({ missingInput: error.missingInput });
    return res.status(error.status).json({ error: error.message });
  }
}

module.exports = register;
