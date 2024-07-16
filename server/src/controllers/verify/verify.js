const { findUnique } = require("../../prismaFunctions/prisma");

async function verify(req, res) {
  try {
    const data = req.body;

    const verifyInput = await findUnique("user", { [data.input]: data.value });

    if (verifyInput)
      return res.json({
        validate: true,
        message: `O ${data.input} digitado já esta registrado, por favor tente novamente ou peça uma nova senha.`,
      });
    return res.json(false);
  } catch (error) {
    await prisma.log.create({
      data: {
        message: JSON.stringify(error),
        path: "verify",
      },
    });
    return res.status(error.status).json({ error: error.message });
  }
}

module.exports = verify;
