const express = require("express");

const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.protect);

router
  .route("/checkout-session/:cartId")
  .get(authController.restrictTo("user"), checkoutSession);

router
  .route("/:cartId")
  .post(authController.restrictTo("user"), createCashOrder);

router
  .route("/:id/pay")
  .patch(authController.restrictTo("admin"), updateOrderToPaid);

router
  .route("/:id/deliver")
  .patch(authController.restrictTo("admin"), updateOrderToDelivered);

router
  .route("/")
  .get(
    authController.restrictTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router
  .route("/:id")
  .get(
    authController.restrictTo("user", "admin", "manager"),
    findSpecificOrder
  );

module.exports = router;
