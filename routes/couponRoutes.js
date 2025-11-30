const express = require("express");

const {
  getAllCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const authController = require("../controllers/authController");

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo("admin", "manager")
);

router.route("/").get(getAllCoupons).post(createCoupon);

router.route("/:id").get(getCoupon).patch(updateCoupon).delete(deleteCoupon);

module.exports = router;
