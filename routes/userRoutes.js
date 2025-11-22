const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
} = require("../utils/validators/userValidator");
const authController = require("../controllers/authController");

const router = express.Router();
router.patch(
  "/changePassword/:id",
  authController.protect,
  updateUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    getAllUsers
  )
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    getUserValidator,
    getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
