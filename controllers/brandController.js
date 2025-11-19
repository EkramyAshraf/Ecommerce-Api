const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Brand = require("../models/brandModel");

// @desc upload category image
exports.uploadBrandImage = uploadSingleImage("image");

// @desc resize category image
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});

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
