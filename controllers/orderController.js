const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc create order
// @route POST /api/v1/orders/:cartItem
// @access private
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("Cart is empty", 400));
  }

  //2)get order price based on cart price
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3)create order with default payment type cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.address,
    totalOrderPrice,
  });

  //4)after create order, increment product sold and decrement product quantity
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5) clear cart depend on cart Items
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "success",
    order,
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc    Update order delivered status
// @route   PATCH /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("there is no order", 400));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({
    status: "success",
    updatedOrder,
  });
});

// @desc    Update order paid status
// @route   PATCH /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("there is no order", 400));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({
    status: "success",
    updatedOrder,
  });
});

// @desc    create checkout session
// @route   PATCH /api/v1/orders/checkout-session/:cartId
// @access  Protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  //app Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("Cart is empty", 400));
  }

  //2)get order price based on cart price
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3)create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order for ${req.user.name}`,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4)send session to response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  let event;
  // Get the signature sent by Stripe
  const signature = req.headers["stripe-signature"];
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.sendStatus(400).send(`⚠️  Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("create order here....");
    console.log(event);
  }
});
exports.findAllOrders = factory.getAll(Order);
exports.findSpecificOrder = factory.getOne(Order);
