const multer = require("multer");
const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.BACKBLAZE_ENDPOINT_S3);
const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEYID,
    secretAccessKey: process.env.BACKBLAZE_APPLICATIONKEY,
  },
});

const uploadImg = async (req, res) => {
  const file = req.file;

  try {
    await s3
      .headObject({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `${file.originalname}`,
      })
      .promise();

    const url = `https://${process.env.BACKBLAZE_BUCKET}.s3.us-east-005.backblazeb2.com/${file.originalname}`;

    return res.status(200).json({ url, fileExist: true });
  } catch (error) {
    if (error.code === "NotFound") {
      try {
        const upload = await s3
          .upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();
        const location = upload.Location;

        if (!location.includes("https://") && !location.includes("http://")) {
          upload.Location = `https://f005.backblazeb2.com/file${location}`;
        }

        return res.status(201).json({ url: location, fileExist: false });
      } catch (uploadError) {
        console.error(uploadError);
        await prisma.log.create({
          data: {
            message: JSON.stringify(uploadError),
            path: "upload",
          },
        });

        return res.status(uploadError.statusCode || 500).json({
          error: uploadError.message || "Erro ao fazer o upload do arquivo",
        });
      }
    } else {
      await prisma.log.create({
        data: {
          message: error.message || "Erro ao verificar a existência do arquivo",
          path: "upload",
        },
      });
      return res.status(error.statusCode || 500).json({
        error: error.message || "Erro ao verificar a existência do arquivo",
      });
    }
  }
};

module.exports = uploadImg;
