const { PrismaClient } = require("@prisma/client");
const partners = require("../data/partners");

const prisma = new PrismaClient();

async function seedUser() {
  const existingPartner = await prisma.partner.findMany();
  const partnersToCreate = partners.filter(
    (product) => !existingPartner.some((s) => s.name === product.name)
  );

  if (partnersToCreate.length > 0) {
    for (const partner of partnersToCreate) {
      await prisma.partner.create({
        data: partner,
      });
    }
  }
}

module.exports = seedUser;
