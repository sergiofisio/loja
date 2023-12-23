import { Request, Response } from "express";
import path from "path";
import serveFavicon from "serve-favicon";
import productInfo from './../controllers/product/product.info';
import newToken from './../controllers/user/user.token';
import register from './../controllers/user/user.register';
import login from './../controllers/user/user.login';
import verify from './../controllers/verify/verify';
import allProductsList from './../controllers/product/product.list';
import infoHome from './../controllers/infoHome';
import getCategories from "./../controllers/categories";
import infoDb from './../controllers/infoDb';

const openRoute = require("express").Router();

openRoute.get('/', (_: Request, res: Response) => {
    res.json({ init: true })
})
openRoute.get('', (_: Request, res: Response) => {
    res.json({ init: true })
})

openRoute.use(serveFavicon(path.join(__dirname, '..', '..', 'favicon.ico')));

openRoute.get('/productInfo/:productId', productInfo)
openRoute.get("/products", allProductsList)
openRoute.get('/newToken/:email', newToken)
openRoute.get('/homeInfo/:table', infoHome)
openRoute.get('/categories', getCategories)
openRoute.get('/infoHome/:admin', infoDb)
openRoute.post('/register', register)
openRoute.post('/login', login)
openRoute.post('/verify', verify)

module.exports = openRoute;