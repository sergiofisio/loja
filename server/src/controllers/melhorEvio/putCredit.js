const axios = require("axios");

async function PutCredit(req, res) {
  const { redirect, value } = req.body;

  try {
    const balance = await axios
      .request({
        method: "POST",
        url: `${process.env.MELHOR_URL}/balance`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life contato@greenlifesaude.com.br",
        },
        data: { gateway: "mercado-pago", redirect, value },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);

        return error;
      });

    res.json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = PutCredit;
