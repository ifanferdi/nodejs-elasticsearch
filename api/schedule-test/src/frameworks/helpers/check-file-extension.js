const path = require("path");
const checkFileExtension = (file, filetypes) => {
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  return !!extname;
};

module.exports = checkFileExtension;
