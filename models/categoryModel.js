const mongoose = require("mongoose");
// 1) Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category must have a name"],
      unique: [true, "Category must have a unique name"],
      maxlength: [32, "Too long Category name"],
      minlength: [3, "Too short Category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2- Create model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
