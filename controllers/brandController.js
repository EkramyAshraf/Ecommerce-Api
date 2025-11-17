const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

// @desc get all brands
// @route GET /api/v1/brands
// @access public
exports.getAllBrands = factory.getAll(Brand, "Brand");

// @desc create brand
// @route POST /api/v1/brands
// @access private
exports.createBrand = factory.createOne(Brand);

// @desc get a specific brand
// @route GET /api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(Brand);
// @desc update a specific brand
// @route PATCH /api/v1/brands/:id
// @access private
exports.updateBrand = factory.updateOne(Brand);

// @desc delete a specific brand
// @route DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(Brand);
