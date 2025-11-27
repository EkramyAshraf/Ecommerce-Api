const express = require("express");

const {
  addAddress,
  deleteAddress,
  getLoggedUserAddresses,
} = require("../controllers/addressController ");

const authController = require("../controllers/authController");

const { addAddressValidator } = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    getLoggedUserAddresses
  )
  .post(
    authController.protect,
    authController.restrictTo("user"),
    addAddressValidator,
    addAddress
  );

router
  .route("/:address")
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    deleteAddress
  );

module.exports = router;
