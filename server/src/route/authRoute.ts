import uploadImg from "../controllers/upload";
import { Request, Response } from "express";
import createProduct from "./../controllers/product/product.create";
import deleteProduct from "./../controllers/product/product.delete";
import infoDb from "./../controllers/infoDb";
import userAdmin from "./../controllers/user/user.admin";
import userInfo from "./../controllers/user/user.info";
import createAdress from "./../controllers/adress/adress.create";
import updateProduct from "./../controllers/product/product.upload";
import updateUser from "./../controllers/user/user.update";
import frete from "./../controllers/postOffice/frete";
import createOrder from "./../controllers/order/order.create";

const authRoute = require("express").Router();
const multer = require("../middleware/multer");

authRoute.get("/verifyToken", function (_: Request, res: Response) {
  try {
    res.json({ ok: true });
  } catch (error: any) {
    res.json({ ok: false });
  }
});

authRoute.get("/infoUser/:id", userInfo);
authRoute.get("/infoDb/:admin", infoDb);
authRoute.get("/admin/:id", userAdmin);
authRoute.get("/frete/:cep", frete);
authRoute.post("/upload", multer.single("file"), uploadImg);
authRoute.post("/createProduct", createProduct);
authRoute.post("/adress/:id", createAdress);
authRoute.patch("/updateUser/:id", updateUser);
authRoute.patch("/uploadProduct/:id", updateProduct);
authRoute.delete("/deleteProduct/:id", deleteProduct);
authRoute.post("/createOrder/:userId", createOrder);

module.exports = authRoute;
