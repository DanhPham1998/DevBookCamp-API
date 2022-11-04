const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const Course = require('../models/courseModel');
const Bootcamp = require('./../models/bootcampModel');

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getAllCourses = catchAsync(async (req, res, next) => {
  let queryFind = {};

  // Để bắt route /api/v1/bootcamps/:bootcampId/courses
  if (req.params.bootcampId) queryFind = { bootcamp: req.params.bootcampId };

  // const course = await Course.find(query).populate({
  //   path: 'bootcamp',
  //   select: 'name description', // chỉ lấy 2 thuộc tính này khi show
  // });

  const features = new ApiFeatures(
    Course.find(queryFind).populate({
      path: 'bootcamp',
      select: 'name description',
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const course = await features.query;

  res.status(200).json({
    status: 'success',
    result: course.length,
    data: course,
  });
});

// @desc      Get courses
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description', // chỉ lấy 2 thuộc tính này khi show
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: course,
  });
});

// @desc      Add course
// @route     GET /api/v1/bootcamps/:bootcampId/courses/
// @access    Private
exports.addCourse = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner(chủ)
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Your are not add a course this bootcamp because your are not creator boocamp ${bootcamp.id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    status: 'success',
    data: course,
  });
});

// @desc      Update Course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = catchAsync(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner(chủ)
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Your are not update this course because your are not creator course ${course.id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: course,
  });
});

// @desc      Delete Course
// @route     DELETE /api/v1/course/:id
// @access    Private
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner(chủ)
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Your are not delete this course because your are not creator course ${course.id}`,
        401
      )
    );
  }

  course.remove();

  res.status(204).json({
    status: 'success',
    data: course,
  });
});
