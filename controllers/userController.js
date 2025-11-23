const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const bcrypt = require("bcryptjs");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const createToken = require("../utils/createToken");

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
// @access private
exports.getAllUsers = factory.getAll(User, "Users");

// @desc create user
// @route POST /api/v1/users
// @access private
exports.createUser = factory.createOne(User);

// @desc get a specific user
// @route GET /api/v1/users/:id
// @access private
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
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
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

// @desc get logged user data
// @route GET /api/v1/users/getMe
// @access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc update logged user password
// @route PATCH /api/v1/users/updateMyPassword
// @access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new AppError(`No user for this id ${req.params.id}`, 404));
  }
  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

// @desc update logged user Data
// @route PATCH /api/v1/users/updateMe
// @access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  console.log(req.headers.authorization.split(" ")[1]);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
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
  if (!updatedUser) {
    return next(new AppError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

// @desc deactivate logged user
// @route DELETE /api/v1/users/deleteMe
// @access private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
