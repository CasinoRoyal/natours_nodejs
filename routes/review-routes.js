const express = require('express');
const reviewController = require('./../controllers/review-controller');
const authController = require('./../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.addTourIdAndUserId, 
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.protect, reviewController.updateReview)

module.exports = router;