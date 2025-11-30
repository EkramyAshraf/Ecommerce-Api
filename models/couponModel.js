const mongoose = require("mongoose");
// 1) Create Schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon must have a name"],
      unique: [true, "coupon must have a unique name"],
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "coupon must have expire date"],
    },
    discount: {
      type: Number,
      required: [true, "coupon must have discount"],
    },
  },
  { timestamps: true }
);

// 2- Create model
const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
