const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('./../controllers/reviewController');
const { protect, authorize } = require('./../middleware/authProtect');

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(protect, authorize('user', 'admin'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .put(protect, authorize('user', 'admin'), reviewController.updateReview)
  .delete(protect, authorize('user', 'admin'), reviewController.deleteReview);

module.exports = router;
