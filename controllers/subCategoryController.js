const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategoryModel");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");

const ApiFeatures = require("../utils/apiFeatures");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
    req.filterObj = filterObj;
  }
  next();
};

// @desc get all subCategories
// @route GET /api/v1/subcategories
// @access public
exports.getAllSubCategories = factory.getAll(SubCategory, "SubCategory");

// @desc create subCategory
// @route POST /api/v1/subcategories
// @access private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc get a specific subCategory
// @route GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc update a specific SubCategory
// @route PATCH /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = factory.updateOne(SubCategory);
// @desc delete a specific subcategory
// @route DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
