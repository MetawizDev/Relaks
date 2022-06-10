const multer = require("multer");
const multerS3 = require("multer-s3");
const env = require("../configs");

const path = require("path");

const ValidationException = require("../common/exceptions/ValidationException");
const s3 = require("../configs/s3Config");

const fileUploadMiddleware = (files) => {
  const storage = multerS3({
    s3,
    bucket: env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      let base = "";
      switch (req.baseUrl) {
        case "/api/v1/categories":
          base = `categories`;
          break;
        case "/api/v1/food-items":
          base = `food-items`;
          break;
        case "/api/v1/promotions":
          base = `promotions`;
          break;
        default:
          var now = Date.now().toString();
          base = `${now}`;
          break;
      }
      const fileExt = path.parse(file.originalname).ext;
      const imageName = req.params.id;
      fileName = `${base}/${imageName}${fileExt}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new ValidationException([{ message: "Only .png, .jpg and .jpeg format allowed!" }]));
    }
  };

  const limits = {
    fileSize: 3000000,
    files,
  };

  const upload = multer({ storage, limits, fileFilter }).single("file");

  return async (req, res, next) => {
    await upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return next(new ValidationException([{ message: err.message }]));
      } else if (err) {
        return next(err);
      }
      return next();
    });
  };
};

module.exports = fileUploadMiddleware;
