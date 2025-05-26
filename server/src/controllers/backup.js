const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
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

    users.forEach((user) => {
      delete user.id_user;
      delete user.createdAt;
      delete user.updatedAt;
    });

    products.forEach((product) => {
      delete product.id;
      delete product.createdAt;
      delete product.updatedAt;
    });

    categories.forEach((category) => {
      delete category.id;
      delete category.createdAt;
      delete category.updatedAt;
    });

    testimonials.forEach((testimonial) => {
      delete testimonial.id;
      delete testimonial.createdAt;
      delete testimonial.updatedAt;
    });

    partners.forEach((partner) => {
      delete partner.id;
      delete partner.createdAt;
      delete partner.updatedAt;
    });

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

    const backupPath = path.join(__dirname, "../../backup/backup.json");
    fs.writeFileSync(backupPath, JSON.stringify(backupData));

    const mailOptions = {
      from: `"Greenlife Backup" <${process.env.GMAIL_USER}>`,
      to: "sergiobastosfisio@yahoo.com.br",
      subject: `Database Backup - GREENLIFE DATA: ${date}`,
      text: "Please find attached the latest database backup.",
      attachments: [{ path: backupPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Erro ao enviar o e-mail de backup:", error.message);
      } else {
        console.log("✅ E-mail de backup enviado com sucesso!");
        console.log("📤 Resposta do servidor de e-mail:", info.response);
        console.log("📧 ID da mensagem:", info.messageId);
      }
    });
    console.log("Backup completed.");
  } catch (error) {
    console.error("Backup failed:", error.response.data);
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
