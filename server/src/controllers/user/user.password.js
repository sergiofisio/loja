const { CustomError } = require("../../class/class");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { createTransport } = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = createTransport({
  host: process.env.ZOHO_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASSWORD,
  },
});

const prisma = new PrismaClient();

async function recoverPassword(req, res) {
  const { email, url } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return;
    }
    if (!process.env.JWT_SECRET)
      throw new CustomError("Erro interno, Favor contactar o suporte!", 500);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lostPassword: token },
    });

    let tokenBase64Url = Buffer.from(token).toString("base64url");

    const urlLost = `${url}/resetPassword/${tokenBase64Url}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Redefinir Senha",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Redefinir Senha</title>
      </head>
      <body style="text-align: center;">
          <h1 style="text-align: center;">Olá, ${user.name}</h1>
          <p>Você solicitou a redefinição de sua senha. Use o seguinte link para redefinir sua senha:</p>
          <p><a href="${urlLost}" style="display: inline-block; margin: 0 auto;">Clique aqui para redefinir sua senha</a></p>
          <p>Se você não solicitou a redefinição de senha, por favor, ignore este email.</p>
          <p>Atenciosamente,</p>
          <p>Sua Equipe</p>
      </body>
      </html>
    `,
    };

    const response = transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error;
      } else {
        throw new CustomError(info.response, 400);
      }
    });

    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  const token = Buffer.from(req.params.token, "base64url").toString();
  const { password } = req.body;

  try {
    if (!token) throw new CustomError("Invalid information", 400);
    if (!process.env.JWT_SECRET)
      throw new CustomError("Erro interno, Favor contactar o suporte!", 500);
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) throw new CustomError("Invalid information", 400);
    const user = await prisma.user.findFirst({
      where: { lostPassword: token },
    });
    if (!user) throw new CustomError("Invalid information", 400);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 10), lostPassword: null },
    });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
}

module.exports = { recoverPassword, changePassword };
