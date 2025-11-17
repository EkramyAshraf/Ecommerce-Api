/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");

const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
// @desc get all product
// @route GET /api/v1/products
// @access public
exports.getAllProducts = factory.getAll(Product, "Product");

// @desc create product
// @route POST /api/v1/products
// @access private
exports.createProduct = factory.createOne(Product);

// @desc get a specific product
// @route GET /api/v1/products/:id
// @access public
exports.getProduct = factory.getOne(Product);

// @desc update a specific product
// @route PATCH /api/v1/products/:id
// @access private
exports.updateProduct = factory.updateOne(Product);

// @desc delete a specific product
// @route DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = factory.deleteOne(Product);
