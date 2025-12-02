/* eslint-disable arrow-body-style */
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const User = require("../models/userModel");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanitizeUser");

// @desc signup
// @route POST /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
  //1)create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //2)generate token
  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
});

// @desc login
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  //1)check if email and password exist in body
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  //2)check if user exist and password is correct
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //2)generate token
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    data: sanitizeUser(user),
    token,
  });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1)Getting token and check if it is there
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in, please login to get access", 401)
    );
  }

  //2)verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("this user is no longer exists", 401));
  }

  //4)check if user change his password after login
  if (currentUser.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changedTimeStamp > decoded.iat) {
      return next(
        new AppError("user recently change password, please login again!", 401)
      );
    }
  }

  //5)Grant Access to protected routes
  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403)
      );
    }
    next();
  };
};

// @desc forgot password
// @route POST /api/v1/auth/forgotPassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get user based on Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user for that Email", 404));
  }
  //2)if user exist ,generate random 6 digits and encrypted it and save to DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  //add expiration time for password reset code
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  //send reset code via Email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new AppError("there is an error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to Email",
  });
});

// @desc verify reset password
// @route POST /api/v1/auth/verifyResetCode
// @access public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  //1)get user based on resetCode
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2)reset code valid
  if (!user) {
    return next(new AppError("Invalid reset code", 401));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Reset code is valid",
  });
});

// @desc reset password
// @route PATCH /api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)get user based on Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user for that Email", 404));
  }
  //2)check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError("reset code is not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  //3)generate new token
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
