const { prisma } = require("../prismaFunctions/prisma");
const { findMany } = require("../prismaFunctions/prisma");
const axios = require("axios");

const infoDb = async (req, res) => {
  let allUsersInfo = [];
  const { admin } = req.params;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  try {
    const products = await findMany("product");
    let users = await prisma.user.findMany();
    for (const user of users) {
      const userInfo = {
        admin: user.admin,
        user: {},
        adresses: [],
        orders: [],
      };

      const infoUser = await axios
        .request({
          method: "GET",
          url: `${process.env.BASE_URL}/customers/${user.id}`,
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          throw new Error(error);
        });

      const adresses = await axios
        .request({
          method: "GET",
          url: `${process.env.BASE_URL}/customers/${user.id}/addresses`,
          params: { page: "1", size: "999" },
          headers: {
            accept: "application/json",
            authorization: `Basic ${basicAuthorization}`,
          },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          throw new Error(error);
        });

      const { cart } = await prisma.user.findUnique({
        where: { id: user.id },
        include: { cart: true },
      });

      userInfo.user = infoUser;
      userInfo.adresses = adresses;
      userInfo.orders = cart;

      allUsersInfo.push(userInfo);
    }

    if (admin !== "true") {
      allUsersInfo = [];
    }
    const testimonials = await findMany("testimonial");
    const partners = await findMany("partner", {
      cart: true,
    });

    res.json({ products, users: allUsersInfo, testimonials, partners });
  } catch (error) {
    await prisma.log.create({
      data: {
        message: JSON.stringify(error),
        path: "infoDb",
      },
    });
    console.error(error);
  }
};

module.exports = infoDb;
