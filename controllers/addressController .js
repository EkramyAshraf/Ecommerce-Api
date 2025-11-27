const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

// @desc Add Address
// @route POST /api/v1/addresses
// @access private/protected
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc delete address
// @route DELETE /api/v1/addresses/:address
// @access private/protected
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.address } },
    },
    {
      new: true,
    }
  );

  res.status(204).json({
    status: "success",
    message: "Address deleted successfully",
    data: user.addresses,
  });
});

// @desc logged user addresses
// @route GET /api/v1/addresses/
// @access private/protected
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
