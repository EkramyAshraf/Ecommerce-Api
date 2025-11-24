const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");

const Review = require("../models/reviewModel");

// @desc get all Reviews
// @route GET /api/v1/reviews
// @access public
exports.getAllReviews = factory.getAll(Review, "Review");

// @desc create Review
// @route POST /api/v1/reviews
// @access private/protect/user
exports.createReview = factory.createOne(Review);

// @desc get a specific Review
// @route GET /api/v1/reviews/:id
// @access public
exports.getReview = factory.getOne(Review);

// @desc update a specific Review
// @route PATCH /api/v1/reviews/:id
// @access private/protect/user
exports.updateReview = factory.updateOne(Review);

// @desc delete a specific Review
// @route DELETE /api/v1/reviews/:id
// @access private/protect/user
exports.deleteReview = factory.deleteOne(Review);
