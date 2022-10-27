const multer = require('multer');
const sharp = require('sharp');
const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const geocoder = require('./../utils/geocoder');

const upload = require('./../middleware/uploadImage');

// @desc      Get All Bootcamp
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getAllBookcamp = catchAsync(async (req, res, next) => {
  let queryFind = {};

  const features = new ApiFeatures(
    Bootcamp.find(queryFind).populate('courses'),
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
    return new ErrorResponse(
      `Bootcamp not found with id ${req.params.id}`,
      404
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
  const newBookcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newBookcamp,
  });
});

// @desc      Upload A Bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBookCamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: bootcamp,
  });
});

// @desc      Delete A Bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBookCamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
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
  console.log(loc);
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

// @desc      Upload Bootcamp Photo
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.uploadBootcampPhoto = upload.single('photo');

// @desc      Resize Bootcamp Photo
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.resizeBootcampPhoto = catchAsync(async (req, res, next) => {
  //console.log(req.file);
  if (!req.file) return next();

  req.file.filename = `bootcamp-${req.params.id}-${Date.now()}.jpeg`;

  // Resize ảnh và dung lương ảnh
  // Dùng await vì sharp trả ra 1 promise nên có thể chậm
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/bootcamps/${req.file.filename}`);
  next();
});
