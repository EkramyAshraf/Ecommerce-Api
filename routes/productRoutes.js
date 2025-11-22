const express = require("express");

const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../controllers/productController");
const authController = require("../controllers/authController");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
