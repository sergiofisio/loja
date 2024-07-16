const axios = require("axios");
const { prisma } = require("../../prismaFunctions/prisma");
const bcrypt = require("bcrypt");
const { CustomError } = require("../../class/class");

async function editUser(req, res) {
  const { id } = req.params;
  let { name, email, document, phone, password } = req.body;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_PP}:`).toString(
    "base64"
  );

  try {
    const options = {
      method: "PUT",
      url: `${process.env.BASE_URL_PAGARME}/customers/${id}`,
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
            country_code: "+55",
            area_code: phone.slice(0, 2),
            number: phone.slice(2),
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
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new CustomError(error.response.data.errors, 400);
      });

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = editUser;
