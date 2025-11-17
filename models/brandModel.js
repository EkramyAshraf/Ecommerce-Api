const mongoose = require("mongoose");
// 1) Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand must have a name"],
      unique: [true, "brand must have a unique name"],
      maxlength: [32, "Too long brand name"],
      minlength: [3, "Too short brand name"],
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
const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
