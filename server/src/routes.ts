const express = require("express");
import { Request, Response, NextFunction } from "express";
import verifyToken from "./middleware/auth";

const allRoutes = express();

allRoutes.use(express.json());

allRoutes.use((req: Request, _: Response, next: NextFunction) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('url: ', url);
    console.log('metodo: ', req.method);
    next();
});

allRoutes.use(require("./route/openRoute"));

allRoutes.use(verifyToken);

allRoutes.use(require("./route/authRoute"));

module.exports = allRoutes;
