const uploadImg = require("../controllers/upload");
const createProduct = require("../controllers/product/product.create");
const deleteProduct = require("../controllers/product/product.delete");
const infoDb = require("../controllers/infoDb");
const userAdmin = require("../controllers/user/user.admin");
const userInfo = require("../controllers/user/user.info");
const createAdress = require("../controllers/adress/adress.create");
const updateProduct = require("../controllers/product/product.upload");
const updateUser = require("../controllers/user/user.update");
const frete = require("../controllers/postOffice/frete");
const createOrder = require("../controllers/order/order.create");
const verifyOrder = require("../controllers/order/order.verify");
const finishOrder = require("../controllers/order/order.finish");
const { getAllOrders } = require("../controllers/order/order.get");
const allUsersInfo = require("../controllers/user/user.allUsers");
const deleteAdresses = require("../controllers/adress/adress.delete");
const ticket = require("../controllers/postOffice/ticket");
const Balance = require("../controllers/melhorEvio/balance");
const PutCredit = require("../controllers/melhorEvio/putCredit");
const cupom = require("../controllers/partner/cupom");

const authRoute = require("express").Router();
const multer = require("../middleware/multer");

authRoute.get("/verifyToken", function (_, res) {
  try {
    res.json({ ok: true });
  } catch (error) {
    res.json({ ok: false });
  }
});

authRoute.get("/infoUser/:id", userInfo);
authRoute.get("/infoDb/:admin", infoDb);
authRoute.get("/admin/:id", userAdmin);
authRoute.get("/verifyOrder/:order_id", verifyOrder);
authRoute.get("/getOrders/:customer_id", getAllOrders);
authRoute.get("/balance", Balance);
authRoute.get("/cupom/:code", cupom);
authRoute.post("/frete/:cep", frete);
authRoute.post("/upload", multer.single("file"), uploadImg);
authRoute.post("/createProduct", createProduct);
authRoute.post("/adress/:id", createAdress);
authRoute.post("/createOrder/:userId", createOrder);
authRoute.post("/ticket", ticket);
authRoute.post("/balance", PutCredit);
authRoute.patch("/updateUser/:id", updateUser);
authRoute.patch("/uploadProduct/:id", updateProduct);
authRoute.patch("/finishOrder/:order_id", finishOrder);
authRoute.delete("/deleteProduct/:id", deleteProduct);
authRoute.delete("/deleteAdress/:id", deleteAdresses);

module.exports = authRoute;
