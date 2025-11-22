const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const User = require("../models/userModel");

// @desc upload user image
exports.uploadUserImage = uploadSingleImage("profileImg");

// @desc resize category image
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    req.body.profileImg = fileName;
  }

  next();
});

// @desc get all users
// @route GET /api/v1/users
// @access public
exports.getAllUsers = factory.getAll(User, "Users");

// @desc create user
// @route POST /api/v1/users
// @access private
exports.createUser = factory.createOne(User);

// @desc get a specific user
// @route GET /api/v1/users/:id
// @access public
exports.getUser = factory.getOne(User);
// @desc update a specific user
// @route PATCH /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: document,
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: req.body.password,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: document,
  });
});

// @desc delete a specific user
// @route DELETE /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
