const env = require("../../configs");
const s3 = require("../../configs/s3Config");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const NotFoundException = require("../exceptions/NotFoundException");
const ConflictException = require("../exceptions/ConflictException");

const deleteImageHandler = async (imgUrl) => {
  var bucketParams = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: imgUrl,
  };

  try {
    return await s3.send(new DeleteObjectCommand(bucketParams));
  } catch (err) {
    throw new ConflictException("Delete image failed! Try again in some time!");
  }
};

module.exports = deleteImageHandler;
