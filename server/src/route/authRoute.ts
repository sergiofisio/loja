import uploadImg from "../controllers/upload";
import { Request, Response } from "express";
import createProduct from './../controllers/product/product.create';
import deleteProduct from './../controllers/product/product.delete';
import infoDb from './../controllers/infoDb';
import userAdmin from './../controllers/user/user.admin';
import userInfo from './../controllers/user/user.info';
import registerAdress from './../controllers/user/user.adress';
import updateProduct from './../controllers/product/product.upload';

const authRoute = require("express").Router();
const multer = require("../middleware/multer");

authRoute.get('/verifyToken', function (_: Request, res: Response) {
    try {
        res.json({ ok: true });
    } catch (error: any) {
        res.json({ ok: false })
    }
})

authRoute.get('/infoUser/:id', userInfo)
authRoute.get('/infoDb', infoDb)
authRoute.get('/admin/:id', userAdmin)
authRoute.post("/upload", multer.single("file"), uploadImg);
authRoute.post('/createProduct', createProduct)
authRoute.post('/adress', registerAdress)
authRoute.patch('/uploadProduct/:id', updateProduct)
authRoute.delete('/deleteProduct/:id', deleteProduct)

module.exports = authRoute;