const express = require("express");

const {
  getAllBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brandController");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getAllBrands)
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
