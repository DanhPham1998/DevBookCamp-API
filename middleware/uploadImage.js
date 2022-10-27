// Lưu tạm vào bộ nhớ
const ErrorResponse = require('./../utils/errorResponse');
const multer = require('multer');
const multrStorage = multer.memoryStorage();

// Filer file
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse('Not an image! Please upload only images.', 400),
      false
    );
  }
};

// Khởi tạo multer
const upload = multer({
  storage: multrStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
