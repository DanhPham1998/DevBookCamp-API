const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams: true để router khác sử dụng

// Import router other
const courseController = require('./../controllers/courseController');
const { protect, authorize } = require('./../middleware/authProtect');

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(protect, authorize('publisher', 'admin'), courseController.addCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(protect, authorize('publisher', 'admin'), courseController.updateCourse)
  .delete(
    protect,
    authorize('publisher', 'admin'),
    courseController.deleteCourse
  );

module.exports = router;
