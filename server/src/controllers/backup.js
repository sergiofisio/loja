const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const nodemailer = require("nodemailer");
const axios = require("axios");
const writeLogError = require("../functions/log");

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

async function fetchUserInfo(user, basicAuthorization) {
  const userInfoResponse = await axios
    .get(`https://api.pagar.me/core/v5/customers/${user.id}`, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
    })
    .catch((error) => error);

  const addressesResponse = await axios
    .get(`https://api.pagar.me/core/v5/customers/${user.id}/addresses`, {
      params: { page: "1", size: "999" },
      headers: {
        accept: "application/json",
        authorization: `Basic ${basicAuthorization}`,
      },
    })
    .catch((error) => error);

  const { cart } = await prisma.user.findUnique({
    where: { id: user.id },
    include: { cart: true },
  });

  return {
    ...user,
    user: userInfoResponse.data,
    adresses: addressesResponse.data,
    orders: cart,
  };
}

async function backup(_, res) {
  const date = new Date().toISOString().replace(/:/g, "-");
  try {
    const basicAuthorization = Buffer.from(
      `${process.env.SECRET_KEY}:`
    ).toString("base64");
    const [users, products, categories, testimonials, partners] =
      await Promise.all([
        prisma.users.findMany(),
        prisma.product.findMany(),
        prisma.category.findMany(),
        prisma.testimonial.findMany(),
        prisma.partner.findMany(),
      ]);

    console.log({ users, products, categories, testimonials, partners });

    const allUsersInfo = await Promise.all(
      users.map((user) => fetchUserInfo(user, basicAuthorization))
    );

    const backupData = {
      users: allUsersInfo,
      products,
      categories,
      testimonials,
      partners,
    };

    const backupPath = `../server/backup/backup.json`;
    fs.writeFileSync(backupPath, JSON.stringify(backupData));

    await prisma.$disconnect();

    const mailOptions = {
      from: process.env.ZOHO_USER,
      to: "sergiobastosfisio@yahoo.com.br",
      subject: `Database Backup - GREENLIFE DATA: ${date}`,
      text: "Please find attached the latest database backup.",
      attachments: [{ path: backupPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log("Backup completed.");
    res.json({ backup: "Backup completed." });
  } catch (error) {
    writeLogError("Erro ao criar backup", "backup");
    res.status(500).send("Backup failed.");
  }
}

module.exports = backup;
