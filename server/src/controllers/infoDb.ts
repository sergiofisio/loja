import axios from "axios";
import { findMany } from "../prismaFunctions/prisma";
import { Request, Response } from "express";

const infoDb = async (req: Request, res: Response) => {
  const { admin } = req.params as { admin: string | null };

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
  } catch (error: any) {
    console.log(error);
  }
};

export default infoDb;
