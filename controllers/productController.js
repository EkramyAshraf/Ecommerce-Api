const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");

// @desc upload mix of images
exports.uploadProductImages = uploadMixOfImages([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// @desc resize product images
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1)coverImage
  if (req.files.coverImage) {
    const coverImageFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${coverImageFileName}`);
    req.body.coverImage = coverImageFileName;
  }

  //2)images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageFileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(500, 500)
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageFileName}`);
        req.body.images.push(imageFileName);
      })
    );
  }
  next();
});

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
