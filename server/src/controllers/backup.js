const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASSWORD,
  },
});

async function backup(_, res) {
  console.log("Starting backup...");
  const date = new Date().toISOString().replace(/:/g, "-");
  try {
    let backupData = {};
    const basicAuthorization = Buffer.from(
      `${process.env.SECRET_KEY}:`
    ).toString("base64");
    const allUsersInfo = [];
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    const categories = await prisma.category.findMany();
    const testimonials = await prisma.testimonial.findMany();
    const partners = await prisma.partner.findMany();

    for (const user of users) {
      const userInfo = {
        ...user,
        admin: user.admin,
        user: {},
        adresses: [],
        orders: [],
      };
      const infoUser = await axios
        .request({
          method: "GET",
          url: `https://api.pagar.me/core/v5/customers/${user.id}`,
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
      const adresses = await axios
        .request({
          method: "GET",
          url: `https://api.pagar.me/core/v5/customers/${user.id}/addresses`,
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
          return error;
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

    backupData.users = allUsersInfo;
    backupData.products = products;
    backupData.categories = categories;
    backupData.testimonials = testimonials;
    backupData.partners = partners;

    const backupPath = `../server/backup/backup_${date}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(backupData));

    await prisma.$disconnect();

    let mailOptions = {
      from: process.env.ZOHO_USER,
      to: "sergiobastosfisio@yahoo.com.br",
      subject: `Database Backup - GREENLIFE DATA: ${date}`,
      text: "Please find attached the latest database backup.",
      attachments: [
        {
          path: backupPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      console.log({ error, info });
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
        fs.writeFileSync(backupPath, JSON.stringify([]));
      }
    });
    console.log("Backup completed.");
    res.json({ backup: "Backup completed." });
  } catch (error) {
    console.error(error);
  }
}

module.exports = backup;
