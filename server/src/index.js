require("dotenv").config();
const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");
const cors = require("cors");
const allRoutes = require("./routes");
const os = require("os");

const app = express();

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIP = getLocalIP();
const hostname = process.env.DOMAIN || localIP;

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

const PORT_HTTP = process.env.PORT || 3000;
const PORT_HTTPS = 4000;

const isProduction = process.env.NODE_ENV === "production";
const keyPath = "/etc/letsencrypt/live/devsergiofisico.com.br/privkey.pem";
const certPath = "/etc/letsencrypt/live/devsergiofisico.com.br/fullchain.pem";

if (isProduction && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
    console.log(
      `🔐 Servidor HTTPS rodando em: https://${hostname}:${PORT_HTTPS}`
    );
  });

  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
      });
      res.end();
    })
    .listen(80, () => {
      console.log(
        `🌐 Redirecionamento HTTP → HTTPS ativo em: http://${hostname}:80`
      );
    });
} else {
  http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`🚀 Servidor HTTP rodando em: http://${hostname}:${PORT_HTTP}`);
  });
}
