const Bookcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');
exports.getAllBookcamp = catchAsync(async (req, res, next) => {
  const bookcamp = await Bookcamp.find();
  res.status(200).json({
    status: 'success',
    result: bookcamp.length,
    data: bookcamp,
  });
});

exports.getBookcamp = catchAsync(async (req, res, next) => {
  const bookcamp = await Bookcamp.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: bookcamp,
  });
});

exports.createBookcamp = catchAsync(async (req, res, next) => {
  const newBookcamp = await Bookcamp.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newBookcamp,
  });
});

exports.updateBookCamp = catchAsync(async (req, res, next) => {
  const bookcamp = await Bookcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: bookcamp,
  });
});

exports.deleteBookCamp = catchAsync(async (req, res, next) => {
  const bookcamp = await Bookcamp.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: 'Delete success',
  });
});
