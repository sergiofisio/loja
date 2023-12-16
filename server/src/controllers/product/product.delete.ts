import { CustomError } from "../../class/class";
import { deleteOne, findUnique } from "../../prismaFunctions/prisma";
import { Request, Response } from "express";

import multer from "multer";

const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.BACKBLAZE_ENDPOINT_S3);
const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.BACKBLAZE_KEYID,
        secretAccessKey: process.env.BACKBLAZE_APPLICATIONKEY,
    },
});


async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const findProduct = await findUnique('product', {
            id: Number(id)
        }, { images: true })

        if (!findProduct) {
            throw new CustomError("Produto não encontrado", 400);
        };

        if (findProduct.images) {

            for (const { id, url } of findProduct.images) {

                await deleteOne('productImage',
                    id
                )

                const img = await s3.deleteObject({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: url.split('/')[4]
                }).promise();

                console.log(img);

            }
        }

        await deleteOne('product', findProduct.id);

        return res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error: any) {
        console.log(error);

        return res.status(error.status).json({ error: error.message });
    }
}

export default deleteProduct