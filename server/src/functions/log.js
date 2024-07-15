const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
async function writeLogError(error, route) {
  try {
//    await prisma.log.create({
//     data:{
//       error: error,
//       path: route
//     }
//    })
  } catch (error) {
  }
}

module.exports = writeLogError;
