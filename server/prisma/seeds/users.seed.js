const { PrismaClient } = require("@prisma/client");
const users = require("../data/users");

const prisma = new PrismaClient();

async function seedUser() {
  const existingUsers = await prisma.user.findMany();
  const usersToCreate = users.filter(
    (user) => !existingUsers.some((s) => s.email === user.email)
  );

  if (usersToCreate.length > 0) {
    for (const user of usersToCreate) {
      await prisma.user.create({
        data: user,
      });
    }
  }
}

module.exports = seedUser;
