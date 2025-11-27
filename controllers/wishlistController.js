const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

// @desc Add product to wishlist
// @route POST /api/v1/wishlist
// @access private/protected
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc delete product from wishlist
// @route DELETE /api/v1/wishlist/:productId
// @access private/protected
exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    {
      new: true,
    }
  );

  res.status(204).json({
    status: "success",
    message: "Product deleted successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc logged user wishlist
// @route GET /api/v1/wishlist/
// @access private/protected
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    data: user.wishlist,
  });
});
