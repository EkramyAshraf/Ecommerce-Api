const express = require("express");

const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

const {
  addToWishlistValidator,
  deleteWishlistValidator,
} = require("../utils/validators/userValidator");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    getLoggedUserWishlist
  )
  .post(
    authController.protect,
    authController.restrictTo("user"),
    addToWishlistValidator,
    addProductToWishlist
  );

router
  .route("/:productId")
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    deleteWishlistValidator,
    deleteProductFromWishlist
  );

module.exports = router;
