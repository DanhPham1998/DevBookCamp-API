const express = require('express');
const router = express.Router();

const bootcampController = require('../controllers/bootcampController');
const {
  uploadBootcampPhoto,
  resizeBootcampPhoto,
} = require('../middleware/uploadImage');

// Import router other
const courseRouter = require('./courseRoutes');
const reviewRouter = require('./reviewRoutes');
const { protect, authorize } = require('./../middleware/authProtect');

// Re-Router(Nối router) từ router bootcamm sang router courser
// để lấy tất cả khoả học(course) thuộc id của bootcamp này
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(bootcampController.getAllBookcamp)
  .post(
    protect,
    authorize('publisher', 'admin'),
    bootcampController.createBookcamp
  );

router
  .route('/:id')
  .get(bootcampController.getBookcamp)
  .put(
    protect,
    authorize('publisher', 'admin'),
    uploadBootcampPhoto,
    resizeBootcampPhoto('bootcamp', 'bootcamps'),
    bootcampController.updateBookCamp
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    bootcampController.deleteBookCamp
  );

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampController.getBootcampsInradius);
module.exports = router;
