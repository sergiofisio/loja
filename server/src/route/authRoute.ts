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
import { verifyOrder } from "./../controllers/order/order.verify";
import { finishOrder } from "./../controllers/order/order.finish";
import { getAllOrders } from "./../controllers/order/order.get";
import allUsersInfo from "../controllers/user/user.allUsers";

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
authRoute.get("/allUsersInfo", allUsersInfo);
authRoute.get("/admin/:id", userAdmin);
authRoute.get("/frete/:cep", frete);
authRoute.get("/verifyOrder/:order_id", verifyOrder);
authRoute.get("/getOrders/:customer_id", getAllOrders);
authRoute.post("/upload", multer.single("file"), uploadImg);
authRoute.post("/createProduct", createProduct);
authRoute.post("/adress/:id", createAdress);
authRoute.post("/createOrder/:userId", createOrder);
authRoute.patch("/updateUser/:id", updateUser);
authRoute.patch("/uploadProduct/:id", updateProduct);
authRoute.patch("/finishOrder/:order_id", finishOrder);
authRoute.delete("/deleteProduct/:id", deleteProduct);

module.exports = authRoute;
