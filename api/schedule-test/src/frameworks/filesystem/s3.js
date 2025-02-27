const {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const AppError = require("../helpers/app-error");
const config = require("../../config/config");

const s3 = new S3Client({
  forcePathStyle: config.s3.forcePathStyle,
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  endpoint: config.s3.endpoint,
});


const bucketName = config.s3.bucketName;

exports.put = async (file, key) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Body: file,
      Key: key,
    })
  );
};

exports.move = async (oldPath, newPath) => {
  try {
    await s3.send(
      new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${oldPath}`,
        Key: newPath,
      })
    );

    await this.delete(oldPath);
  } catch (err) {
    if (err.Code === "NoSuchKey") {
      throw new AppError("File tidak valid", 400);
    } else {
      throw err;
    }
  }
};

exports.delete = async (path) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: path,
      })
    );
  } catch (err) {
    console.log("Error deleting file directory", err);
  }
};

exports.getUrl = async (path) => {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucketName, Key: path }),
    { expiresIn: 3600 }
  );
};
