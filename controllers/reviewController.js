const factory = require("./handlersFactory");

//middlewares for nested routes
exports.setProductUserIdsToBody = (req, res, next) => {
  if (req.params.productId) {
    req.body.product = req.params.productId;
    req.body.user = req.user._id;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
  }
  next();
};

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
