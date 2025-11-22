/* eslint-disable arrow-body-style */
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
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
