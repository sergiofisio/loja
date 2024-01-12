import { CustomError } from "../../class/class";
import { prisma } from "./../../prismaFunctions/prisma";
import { Response } from "express";
import { Request } from "express";

export default async function cupom(req: Request, res: Response) {
  let code = req.params;

  try {
    const cupom = await prisma.partner.findFirst({ where: code });

    if (!cupom) throw new CustomError("Cupom Inválido", 400);

    return res.json({ cupom: true });
  } catch (error: any) {
    return res.status(error.status).json({ error: error.message });
  }
}
