/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiFeatures = require("../utils/apiFeatures");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const multer = require("multer");
const AppError = require("../utils/appError");
const Category = require("../models/categoryModel");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    //category-${id}-Date.now.jpeg
    const ext = file.mimetype.split("/")[1];
    const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("only images allowed", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single("image");

// @desc get all category
// @route GET /api/v1/categories
// @access public
exports.getAllCategories = factory.getAll(Category, "Category");
// @desc create category
// @route POST /api/v1/categories
// @access private
exports.createCategory = factory.createOne(Category);

// @desc get a specific category
// @route GET /api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(Category);

// @desc update a specific category
// @route PATCH /api/v1/categories/:id
// @access private
exports.updateCategory = factory.updateOne(Category);

// @desc delete a specific category
// @route DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = factory.deleteOne(Category);
