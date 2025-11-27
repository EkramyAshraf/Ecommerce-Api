const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("product").custom(async (val, { req }) => {
    //check if logged user create review before
    const review = await Review.findOne({
      user: req.user._id,
      product: val,
    });
    if (review) {
      throw new Error("your already created review for this product");
    }
    return true;
  }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (val, { req }) => {
      //check if this review belongs to logged user
      const review = await Review.findById(val);
      if (!review) {
        throw new Error(`there is no review for this ${val}`);
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("you are not allowed to perform this action");
      }
      return true;
    }),
  body("title").optional(),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (val, { req }) => {
      //check the role is user
      if (req.user.role === "user") {
        //check if this review belongs to logged user
        const review = await Review.findById(val);
        if (!review) {
          throw new Error(`there is no review for this ${val}`);
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("you are not allowed to perform this action");
        }
      }
      return true;
    }),
  validatorMiddleware,
];
