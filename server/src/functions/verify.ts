import { findUnique } from "../prismaFunctions/prisma";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verifyInput = (inputs: any) => {
    for (let input in inputs) {
        if (!inputs[input]) {
            return { missingInput: input };
        }
    }
    return false;
};

module.exports = { verifyInput };
