const { CustomError } = require("../../class/class");
const { prisma } = require("../../prismaFunctions/prisma");

async function cupom(req, res) {
  let code = req.params;

  try {
    const cupom = await prisma.partner.findFirst({ where: code });

    if (!cupom) throw new CustomError("Cupom Inválido", 400);

    return res.json({ cupom: true });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = cupom;
