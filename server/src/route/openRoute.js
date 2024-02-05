const path = require("path");
const serveFavicon = require("serve-favicon");
const productInfo = require("../controllers/product/product.info");
const newToken = require("../controllers/user/user.token");
const register = require("../controllers/user/user.register");
const login = require("../controllers/user/user.login");
const verify = require("../controllers/verify/verify");
const allProductsList = require("../controllers/product/product.list");
const infoHome = require("../controllers/infoHome");
const getCategories = require("../controllers/categories");
const infoDb = require("../controllers/infoDb");
const userPassword = require("../controllers/user/user.password");

const changePassword = userPassword.changePassword;
const recoverPassword = userPassword.recoverPassword;

const express = require("express");
const openRoute = express.Router();

openRoute.get("/", (_, res) => {
  res.json({ init: true });
});
openRoute.get("", (_, res) => {
  res.json({ init: true });
});

openRoute.use(serveFavicon(path.join(__dirname, "..", "..", "favicon.ico")));

openRoute.get("/productInfo/:productId", productInfo);
openRoute.get("/products", allProductsList);
openRoute.get("/newToken/:email", newToken);
openRoute.get("/homeInfo/:table", infoHome);
openRoute.get("/categories", getCategories);
openRoute.get("/infoHome/:admin", infoDb);
openRoute.post("/register", register);
openRoute.post("/login", login);
openRoute.post("/verify", verify);
openRoute.post("/resetPassword", recoverPassword);
openRoute.put("/changePassword/:token", changePassword);

module.exports = openRoute;