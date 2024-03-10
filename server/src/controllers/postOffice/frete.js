const axios = require("axios");

async function frete(req, res) {
  let { cep } = req.params;
  let { amount, document, cart, name } = req.body;

  console.log({ cep, amount, document, cart, name });

  try {
    function volumes() {
      let weight = 0;
      cart.forEach((product) => {
        weight += product.product.peso / 1000;
      });
      console.log(weight);
      return [{ width: 16, height: 16, length: 16, weight, quantity: 1 }];
    }
    volumes();
    const {
      data: { code, prices },
    } = await axios.post(
      `${process.env.CENTRALURL}/v1/quotation`,
      {
        from: "09710212",
        to: cep,
        cargo_types: [1],
        invoice_amount: amount,
        volumes: volumes(),
        recipient: { document, name: `Encomenda de ${name}` },
      },
      {
        headers: {
          Authorization: `${process.env.TOKENCENTRAL}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(code, prices);
    res.json({ code, prices });
  } catch (error) {
    console.log(error.response.data);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = frete;
