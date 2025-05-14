require("dotenv").config();
import fs from "fs";
const express = require("express");
const cors = require("cors");
const allRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, HEAD,POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(allRoutes);

const httpsOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/devsergiofisico.com.br/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/devsergiofisico.com.br/fullchain.pem"
  ),
};

http.createServer(app).listen(3000, () => {
  console.log("🚀 Servidor HTTP rodando na porta 3000");
});

https.createServer(httpsOptions, app).listen(4000, () => {
  console.log("🔐 Servidor HTTPS rodando na porta 4000");
});
