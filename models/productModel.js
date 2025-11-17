const mongoose = require("mongoose");
// 1) Create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product must have a title"],
      maxlength: [100, "Too long product title"],
      minlength: [3, "Too short product title"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: [true, "Product must have a slug"],
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product must have a quantity"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product must have a price"],
      max: [200000, "Too long product price"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    coverImage: {
      type: String,
      required: [true, "Product must have a cover image"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belongs to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAvg: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be less or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
// 2- Create model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
