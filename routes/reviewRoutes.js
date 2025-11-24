const express = require("express");

const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
