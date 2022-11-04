const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const { promisify } = require('util');
const ErrorResponse = require('./../utils/errorResponse');
const User = require('./../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  let accessToken;

  // Get access_token from req.header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accessToken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  //console.log(accessToken);
  if (!accessToken) {
    return next(new ErrorResponse('You are not logged in! Please Login'));
  }

  // Giai ma JWt
  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  //console.log(decoded);

  currentUser = await User.findById(decoded.id);
  // Check account exist
  if (!currentUser) {
    return next(new ErrorResponse('You account is banned or delete', 401));
  }

  // Kiểm tra mật khẩu người dùng có thây đổi sau thời điểm phát hành accessToken không, nếu có không cho đăng nhập
  if (currentUser.checkChangePassword(decoded.iat)) {
    return next(
      new ErrorResponse('User has change password! Please login again', 401)
    );
  }

  req.user = currentUser;
  next();
});

// Phân Quyền
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
