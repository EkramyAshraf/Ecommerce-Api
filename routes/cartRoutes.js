const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeProductFromCart,
  clearLoggedUserCart,
  updateItemQuantity,
  applyCoupon,
} = require("../controllers/cartController");

const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.protect, authController.restrictTo("user"));
router.route("/applyCoupon").patch(applyCoupon);

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearLoggedUserCart);

router
  .route("/:itemId")
  .delete(removeProductFromCart)
  .patch(updateItemQuantity);
module.exports = router;
