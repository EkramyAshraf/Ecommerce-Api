const express = require("express");
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/categoryController");

const subCategoryRoutes = require("./subCategoryRoutes");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const authController = require("../controllers/authController");

const router = express.Router();

//nested routes
router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .get(authController.protect, getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
