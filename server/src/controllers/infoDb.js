const { findMany } = require("../prismaFunctions/prisma");

const infoDb = async (req, res) => {
  const { admin } = req.params;

  try {
    const products = await findMany("product");
    let users = await findMany("user", {
      cart: true,
    });

    if (admin !== "true") {
      users = null;
    }
    const testimonials = await findMany("testimonial");
    const partners = await findMany("partner", {
      cart: true,
    });

    res.json({ products, users, testimonials, partners });
  } catch (error) {
    console.log(error);
  }
};

module.exports = infoDb;
