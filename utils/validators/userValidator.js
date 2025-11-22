const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and Sa phone numbers"),

  check("role").optional(),
  check("active").optional(),
  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      //1)verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("incorrect current password!");
      }

      //2)verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("incorrect password confirm!");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and Sa phone numbers"),

  check("role").optional(),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];
