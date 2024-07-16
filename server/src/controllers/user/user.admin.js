const { findUnique, prisma } = require("../../prismaFunctions/prisma");
const { CustomError } = require("../../class/class");

async function userAdmin(req, res) {
  const { id } = req.params;

  try {
    const userInfo = await findUnique("user", { id });
    if (!userInfo) throw new CustomError("Usuário não encontrado", 403);

    return res.json({ user: userInfo.admin });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = userAdmin;
