const express = require("express");
const path = require("path");

const schedule = require("node-schedule");
const serveFavicon = require("serve-favicon");

// Controllers
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
const allUsersInfo = require("../controllers/user/user.allUsers");
const backup = require("../controllers/backup");

const openRoute = express.Router();

openRoute.use(serveFavicon(path.join(__dirname, "..", "..", "favicon.ico")));

openRoute.get(["/", ""], (_, res) => res.json({ init: true }));
openRoute.get("/allUsersInfo", allUsersInfo);
openRoute.get("/infoDb/:admin", infoDb);
openRoute.get("/productInfo/:productId", productInfo);
openRoute.get("/products", allProductsList);
openRoute.get("/newToken/:email", newToken);
openRoute.get("/homeInfo/:table", infoHome);
openRoute.get("/categories", getCategories);
openRoute.get("/infoHome/:admin", infoDb);
openRoute.post("/register", register);
openRoute.post("/login", login);
openRoute.post("/verify", verify);
openRoute.post("/resetPassword", userPassword.recoverPassword);
openRoute.put("/changePassword/:token", userPassword.changePassword);
openRoute.get("/backup", backup);

// Schedule backup job
schedule.scheduleJob("0 11 * * *", backup);

module.exports = openRoute;
