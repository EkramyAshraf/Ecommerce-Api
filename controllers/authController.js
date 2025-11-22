/* eslint-disable arrow-body-style */
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const User = require("../models/userModel");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
  console.log(user);
  //2)if user exist ,generate random 6 digits and encrypted it and save to DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log(resetCode, hashedResetCode);

  user.passwordResetCode = hashedResetCode;
  //add expiration time for password reset code
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  user.save();
});
