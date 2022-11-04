const ErrorResponse = require('./../utils/errorResponse');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

// @desc      Get All User
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getAllUser = catchAsync(async (req, res, next) => {
  const total = await User.count();
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const user = await features.query;
  res.status(200).json({
    status: 'success',
    result: user.length,
    totalAllUser: total,
    data: user,
  });
});

// @desc      Get User
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`No user found with that ID: ${req.params.id}`, 401)
    );
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

// @desc      Create User
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

// @desc      Update User
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`No user found with that ID: ${req.params.id}`, 401)
    );
  }
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

// @desc      Delete User
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`No user found with that ID: ${req.params.id}`, 401)
    );
  }
  res.status(204).json({
    status: 'success',
    data: {},
  });
});
