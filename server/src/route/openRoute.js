const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const schedule = require("node-schedule");
const serveFavicon = require("serve-favicon");
const winston = require("winston");

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

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../log/error.log"),
    }),
  ],
});

const openRoute = express.Router();

openRoute.use(serveFavicon(path.join(__dirname, "..", "..", "favicon.ico")));

openRoute.use(async (err, req, res, _) => {
  const errorLogPath = path.join(__dirname, "../../log/error.json");
  const errorDetails = {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
  };

  try {
    let data = await fs.readFile(errorLogPath);
    let errors = JSON.parse(data.toString());
    errors.push(errorDetails);

    await fs.writeFile(errorLogPath, JSON.stringify(errors, null, 2));
  } catch (error) {
    console.log({ error });
    logger.error("Error accessing or updating the log file:", error);
  }

  res.status(500).json({ error: "Server error occurred" });
});

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
