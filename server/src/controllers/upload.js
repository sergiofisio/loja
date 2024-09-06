const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImg = async (req, res) => {
  console.log({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Nenhum ficheiro foi enviado." });
  }

  try {
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };
    const result = await uploadToCloudinary(file.buffer);
    return res.status(201).json({ url: result.secure_url, fileExist: false });
  } catch (err) {
    console.error("Erro ao fazer upload para o Cloudinary:", err);

    await prisma.log.create({
      data: {
        message: JSON.stringify(err),
        path: "upload",
      },
    });

    return res.status(500).json({
      error: "Erro ao fazer o upload do ficheiro para o Cloudinary",
    });
  }
};

module.exports = uploadImg;
