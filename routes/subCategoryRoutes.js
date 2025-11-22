const express = require("express");

const {
  getAllSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../controllers/subCategoryController");

const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
