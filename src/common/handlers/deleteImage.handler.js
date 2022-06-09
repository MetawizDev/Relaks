var fs = require("fs");
const NotFoundException = require("../exceptions/NotFoundException");

const deleteImageHandler = (imgUrl) => {
  const path = `.${imgUrl.replace("static", "public")}`;

  try {
    fs.unlinkSync(path);
  } catch (error) {
    throw new NotFoundException("File not found");
  }
};

module.exports = deleteImageHandler;
