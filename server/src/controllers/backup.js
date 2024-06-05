const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");

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

async function backup(req, res) {
  try {
    const tables = Object.keys(prisma).filter(
      (key) => typeof prisma[key]?.findMany === "function"
    );

    let backupData = {};

    for (let table of tables) {
      const data = await prisma[table].findMany();
      backupData[table] = data;
    }

    const backupPath = "../server/backup/backup.json";
    fs.writeFileSync(backupPath, JSON.stringify(backupData));

    await prisma.$disconnect();

    let mailOptions = {
      from: process.env.ZOHO_USER,
      to: "sergiobastosfisio@yahoo.com.br",
      subject: "Database Backup",
      text: "Please find attached the latest database backup.",
      attachments: [
        {
          path: backupPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        fs.writeFileSync(backupPath, JSON.stringify([]));
      }
    });
    res.json({ message: "Backup realizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = backup;
