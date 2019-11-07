const express = require('express');
const reviewController = require('./../controllers/review-controller');
const {protect, restrictTo} = require('./../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    protect,
    restrictTo('user', 'admin'),
    reviewController.addTourIdAndUserId, 
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(protect, restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(protect, restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;