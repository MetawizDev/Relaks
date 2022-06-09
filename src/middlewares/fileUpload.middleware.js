const multer = require("multer");
const path = require("path");
const ValidationException = require("../common/exceptions/ValidationException");
const fs = require("fs");

const fileUploadMiddleware = (subfolder, files) => {
  const folderName = `./public/assets/${subfolder}`;

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderName);
    },
    filename: function (req, file, cb) {
      const fileExt = path.parse(file.originalname).ext;
      const imageName = req.params.id;
      imgName = `${imageName}${fileExt}`;
      req.body.imgUrl = `/assets/${subfolder}/${imgName}`;
      cb(null, imgName);
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

  return (req, res, next) => {
    upload(req, res, function (err) {
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
