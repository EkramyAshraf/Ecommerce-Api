const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");

// @desc upload category image
exports.uploadCategoryImage = uploadSingleImage("image");

// @desc resize category image
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
  req.body.image = fileName;
  next();
});

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
