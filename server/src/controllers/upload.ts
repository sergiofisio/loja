import { Request, Response } from "express";

import multer from "multer";

import aws from "aws-sdk";

interface CustomFile {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}

const endpoint = new aws.Endpoint(process.env.BACKBLAZE_ENDPOINT_S3 as string);
const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.BACKBLAZE_KEYID as string,
        secretAccessKey: process.env.BACKBLAZE_APPLICATIONKEY as string,
    },
});

const uploadImg = async (req: Request, res: Response) => {
    const file: CustomFile = req.file as CustomFile;

    try {
        // Verificar se o arquivo já existe no bucket
        const response = await s3.headObject({
            Bucket: process.env.BACKBLAZE_BUCKET as string,
            Key: `${file.originalname}`,
        }).promise();

        const url = `https://${process.env.BACKBLAZE_BUCKET}.s3.us-east-005.backblazeb2.com/${file.originalname}`;
        console.log(url);


        // Se o arquivo existir, retornar um erro
        return res.status(200).json({ url, fileExist: true });
    } catch (error: any) {
        // Se o arquivo não existir, o método headObject lançará um erro
        if (error.code === 'NotFound') {
            try {
                const upload = await s3.upload({
                    Bucket: process.env.BACKBLAZE_BUCKET as string,
                    Key: `${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }).promise();
                const location = upload.Location

                if (!location.includes("https://") && !location.includes("http://")) {
                    upload.Location = `https://f005.backblazeb2.com/file${location}`
                }

                return res.status(201).json({ url: location, fileExist: false });
            } catch (uploadError: any) {
                console.log(uploadError);

                return res.status(uploadError.statusCode || 500).json({ error: uploadError.message || "Erro ao fazer o upload do arquivo" });
            }
        } else {
            return res.status(error.statusCode || 500).json({ error: error.message || "Erro ao verificar a existência do arquivo" });
        }
    }
};

export default uploadImg