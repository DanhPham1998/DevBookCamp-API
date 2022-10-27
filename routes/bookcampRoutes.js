const express = require('express');
const router = express.Router();

const bookcampController = require('../controllers/bootcampController');

// Import router other
const courseRouter = require('./courseRoutes');

// Re-Router(Nối router) từ router bootcamm sang router courser
// để lấy tất cả khoả học(course) thuộc id của bootcamp này
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(bookcampController.getAllBookcamp)
  .post(bookcampController.createBookcamp);

router
  .route('/:id')
  .get(bookcampController.getBookcamp)
  .put(
    bookcampController.uploadBootcampPhoto,
    bookcampController.resizeBootcampPhoto,
    bookcampController.updateBookCamp
  )
  .delete(bookcampController.deleteBookCamp);

router
  .route('/radius/:zipcode/:distance')
  .get(bookcampController.getBootcampsInradius);
module.exports = router;
