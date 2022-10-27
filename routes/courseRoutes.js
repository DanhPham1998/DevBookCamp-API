const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams: true để router khác sử dụng

const courseController = require('./../controllers/courseController');

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.addCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
