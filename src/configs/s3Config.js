const { S3Client } = require("@aws-sdk/client-s3");
const env = require("../configs");

const s3 = new S3Client({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  Bucket: env.AWS_BUCKET_NAME,
  Region: env.AWS_REGION,
});

module.exports = s3;
