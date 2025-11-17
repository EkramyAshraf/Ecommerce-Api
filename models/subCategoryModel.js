const mongoose = require("mongoose");
// 1) Create Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      maxlength: [32, "Too long SubCategory name"],
      minlength: [2, "Too short SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belongs to parent category"],
    },
  },
  { timestamps: true }
);

// 2- Create model
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
