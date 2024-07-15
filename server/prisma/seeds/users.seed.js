const { PrismaClient } = require("@prisma/client");
const users = require("../data/users");
const axios = require("axios");

const prisma = new PrismaClient();

const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
  "base64"
);

async function seedUser() {
  try {
    const existingUsers = await prisma.user.findMany();
    const usersToCreate = users.filter(
      (user) => !existingUsers.some((s) => s.email === user.email)
    );

    if (usersToCreate.length > 0) {
      for (const user of usersToCreate) {
        const userInfo = await axios
          .request({
            method: "GET",
            url: `https://api.pagar.me/core/v5/customers/${user.id}`,
            headers: {
              accept: "application/json",
              authorization: `Basic ${basicAuthorization}`,
            },
          })
          .then(function (_) {
            return true;
          })
          .catch(function (_) {
            return false;
          });

        if (!userInfo) {
          const options = {
            method: "POST",
            url: `${process.env.BASE_URL}/customers`,
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              authorization: `Basic ${basicAuthorization}`,
            },
            data: {
              email: user.email,
              name: user.name,
              document_type: "CPF",
              document: Number(user.document),
              type: "individual",
              phones: mobile_phone
                ? {
                    mobile_phone: {
                      country_code: user.user.phones.country_code,
                      area_code: user.user.phones.area_code,
                      number: user.user.phones.number,
                    },
                  }
                : "",
              address: country
                ? {
                    country: user.user.address.country,
                    state: user.user.address.state,
                    city: user.user.address.city,
                    zip_code: user.user.zip_code.replace("-", ""),
                    line_1: user.user.address.line_1,
                    line_2: user.user.address.line_2
                      ? user.user.address.city
                      : "",
                  }
                : "",
            },
          };

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
        }
        const userDb = await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            document: user.document,
            password: user.password,
            admin: user.admin,
          },
        });

        if (user.orders.length) {
          for (const order of user.orders) {
            await prisma.cart.create({
              data: {
                idPagarme: order.idPagarme,
                userId: userDb.id,
                products: order.products,
                date: order.date,
                finished: order.finished,
                cartRecoreEmail: order.cartRecoreEmail,
                cartRecover: order.cartRecover,
                partnerId: order.partnerId,
                shippingType: order.shippingType,
                code: order.code,
                shippingPrice: order.shippingPrice,
                amount: order.amount,
                trackingCode: order.trackingCode,
                ticketUrl: order.ticketUrl,
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error({ error });
  }
}

module.exports = seedUser;
