const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const nodemailer = require("nodemailer");
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

const axiosHeaders = (basicAuthorization) => ({
  headers: {
    accept: "application/json",
    authorization: `Basic ${basicAuthorization}`,
  },
});

async function fetchUserInfo(user, basicAuthorization) {
  try {
    const userInfoResponse = await axios.get(
      `https://api.pagar.me/core/v5/customers/${user.id}`,
      axiosHeaders(basicAuthorization)
    );
    const addressesResponse = await axios.get(
      `https://api.pagar.me/core/v5/customers/${user.id}/addresses`,
      {
        ...axiosHeaders(basicAuthorization),
        params: { page: "1", size: "999" },
      }
    );

    const { cart } = await prisma.user.findUnique({
      where: { id: user.id },
      include: { cart: true },
    });

    return {
      ...user,
      user: userInfoResponse.data,
      addresses: addressesResponse.data,
      orders: cart,
    };
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    throw error;
  }
}

async function backup(_, res) {
  const date = new Date().toISOString().replace(/:/g, "-");
  try {
    const basicAuthorization = Buffer.from(
      `${process.env.SECRET_KEY}:`
    ).toString("base64");

    const [users, products, categories, testimonials, partners] =
      await Promise.all([
        prisma.user.findMany(),
        prisma.product.findMany(),
        prisma.category.findMany(),
        prisma.testimonial.findMany(),
        prisma.partner.findMany(),
      ]);

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

    console.log("Backup completed.");

    const mailOptions = {
      from: process.env.ZOHO_USER,
      to: "sergiobastosfisio@yahoo.com.br",
      subject: `Database Backup - GREENLIFE DATA: ${date}`,
      text: "Please find attached the latest database backup.",
      attachments: [{ path: backupPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending backup email:", error.message);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error("Backup failed:", JSON.stringify(error));
    await prisma.log.create({
      data: {
        message: JSON.stringify(error),
        path: "Backup",
      },
    });
    if (res) {
      res.status(500).send("Backup failed.");
    }
  } finally {
    await prisma.$disconnect();

    if (res) {
      res.json({ backup: "Backup process completed." });
    }
  }
}

module.exports = backup;
