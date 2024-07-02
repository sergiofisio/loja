const { CustomError } = require("../../class/class");
const { findUnique } = require("../../prismaFunctions/prisma");
const jwt = require("jsonwebtoken");

async function newToken(req, res) {
  const { email } = req.params;
  try {
    const findEmail = await findUnique("user", { email });
    if (!findEmail) throw new CustomError("Usuário não encontrado", 400);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ id: findEmail.id, token });
  } catch (error) {
    console.error(error);

    res.status(error.status).json({ error: error.message });
  }
}

module.exports = newToken;
