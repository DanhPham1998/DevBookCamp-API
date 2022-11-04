const ErrorResponse = require('./../utils/errorResponse');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const Bootcamp = require('../models/bootcampModel');

// @desc      Get All Review
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getAllReview = catchAsync(async (req, res, next) => {
  let queryFind = {};

  if (req.params.bootcampId) queryFind = { bootcamp: req.params.bootcampId };
  const features = new ApiFeatures(
    Review.find(queryFind).populate({
      path: 'bootcamp',
      select: 'name description',
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const review = await features.query;

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: review,
  });
});

// @desc      Get Review
// @route     GET /api/v1/reviews:id
// @access    Public
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with ID:${req.params.id} `, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: review,
  });
});

// @desc      Create Review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  // Check bootcamp Id
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with ID:${req.params.bootcampId} `,
        404
      )
    );
  }

  // Check 1 Review To 1 Bootcamp with User
  const isReview = await Review.findOne({
    bootcamp: req.params.bootcampId,
    user: req.user.id,
  });

  if (isReview) {
    return next(
      new ErrorResponse(`You already have a review for this bootcamp`, 401)
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

// @desc      Update Review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review found with ID:${req.params.id} `, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Your are not update this review because your are not creator review:${req.params.id} `,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

// @desc      Delete Review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review found with ID:${req.params.id} `, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Your are not delete this review because your are not creator review:${req.params.id} `,
        401
      )
    );
  }

  await review.remove();

  res.status(204).json({
    status: 'success',
    data: {},
  });
});
