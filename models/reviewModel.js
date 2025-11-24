const mongoose = require("mongoose");
// 1) Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "Review rating required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belongs to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belongs to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
