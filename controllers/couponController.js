const factory = require("./handlersFactory");

const Coupon = require("../models/couponModel");

// @desc get all coupon
// @route GET /api/v1/coupons
// @access private/admin-manager
exports.getAllCoupons = factory.getAll(Coupon, "Coupon");

// @desc create Coupon
// @route POST /api/v1/Coupons
// @access private/admin-manager
exports.createCoupon = factory.createOne(Coupon);

// @desc get a specific Coupon
// @route GET /api/v1/Coupons/:id
// @access private/admin-manager
exports.getCoupon = factory.getOne(Coupon);
// @desc update a specific Coupon
// @route PATCH /api/v1/Coupons/:id
// @access private/admin-manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc delete a specific Coupon
// @route DELETE /api/v1/Coupons/:id
// @access private/admin-manager
exports.deleteCoupon = factory.deleteOne(Coupon);
