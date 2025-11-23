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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.protect);
router.route("/getMe").get(getLoggedUserData, getUser);
router.route("/deleteMe").delete(deleteLoggedUser);
router
  .route("/updateMe")
  .patch(updateLoggedUserValidator, updateLoggedUserData);
router
  .route("/updateMyPassword")
  .patch(updateLoggedUserPasswordValidator, updateLoggedUserPassword);
router.patch(
  "/changePassword/:id",

  updateUserPasswordValidator,
  changeUserPassword
);

router.use(authController.restrictTo("admin", "manager"));
router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
