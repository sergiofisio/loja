const axios = require("axios");

async function Balance(_, res) {
  try {
    const balance = await axios
      .request({
        method: "GET",
        url: `${process.env.MELHOR_URL}/balance`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MELHOR_TOKEN}`,
          "User-Agent": "Green Life contato@greenlifesaude.com.br",
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });

    res.json({ balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = Balance;
