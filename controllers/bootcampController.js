const sharp = require('sharp');
const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('./../utils/errorResponse');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const geocoder = require('./../utils/geocoder');

const upload = require('./../middleware/uploadImage');

// @desc      Get All Bootcamp
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getAllBookcamp = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Bootcamp.find().populate('courses'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bootcamp = await features.query;

  res.status(200).json({
    status: 'success',
    result: bootcamp.length,
    data: bootcamp,
  });
});

// @desc      Get A Bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBookcamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: bootcamp,
  });
});

// @desc      Create A Bootcamp
// @route     POST /api/v1/bootcamps/:id
// @access    Private
exports.createBookcamp = catchAsync(async (req, res, next) => {
  // Check if publihser create a bootcamp =>  not allowed create more bootcamp
  // Only 1 publisher with 1 bootcamp
  const publihserExisstC = await Bootcamp.findOne({ user: req.user.id });

  if (publihserExisstC && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `This account with roles is ${req.user.role} exist a bootcamp`,
        400
      )
    );
  }

  // Add user from protect middleware
  req.body.user = req.user.id;

  const newBookcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newBookcamp,
  });
});

// @desc      Delete A Bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBookCamp = catchAsync(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  // Check bootcamp exist
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  // Check user login = user create this bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Your are not the creator this bootcamp`, 401)
    );
  }

  bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorResponse(
      `Bootcamp not found with id ${req.params.id}`,
      404
    );
  }

  bootcamp.remove();

  res.status(204).json({
    status: 'success',
    data: 'Delete success',
  });
});

// @desc      Get All Bootcamp In Rarius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
// @Tìm các bootcamp có trong bán kính dặm từ zipcode
exports.getBootcampsInradius = catchAsync(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get vĩ độ kinh độ từ zipcode nhập vào qua geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Lấy bán kính nhập vào distance chia số dặm trên trái đất
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(201).json({
    status: 'success',
    result: bootcamps.length,
    data: bootcamps,
  });
});

// @desc      Upload A Bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBookCamp = catchAsync(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  // Check bootcamp exist
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  // Check user login = user create this bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Your are not the creator this bootcamp`, 401)
    );
  }

  // Check nếu có file thì gắn body photo
  if (req.file) req.body.photo = req.file.filename;

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: bootcamp,
  });
});
