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

const router = express.Router();
router.use("/:categoryId/subcategories", subCategoryRoutes);
router.use("/:categoryId/subcategories", subCategoryRoutes);
router
  .route("/")
  .get(getAllCategories)
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
