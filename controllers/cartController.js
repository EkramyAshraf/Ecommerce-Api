const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

const calculatePrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc add product to cart
// @route POST /api/v1/cart
// @access private/user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { color, productId } = req.body;
  const product = await Product.findById(productId);
  //1) get logged user cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    //if product exists in cart, update quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      //product not exist in cart ,push product into cartItems Array
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  //calculate total cart price
  calculatePrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc get logged user cart
// @route GET /api/v1/cart
// @access private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new AppError(`no cart items for this user id: ${req.user._id}`)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc remove Product From Cart
// @route DELETE /api/v1/cart/:itemId
// @access private/user
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(
      new AppError(`no cart items for this user id: ${req.user._id}`)
    );
  }

  //calculate total cart price
  calculatePrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc remove logged user Cart
// @route DELETE /api/v1/cart
// @access private/user
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  if (!cart) {
    return next(
      new AppError(`no cart items for this user id: ${req.user._id}`)
    );
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

// @desc update item quantity
// @route UPDATE /api/v1/cart/itemId
// @access private/user
exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new AppError(`no cart items for this user id: ${req.user._id}`)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  }

  //calculate total cart price
  calculatePrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc apply coupon
// @route UPDATE /api/v1/cart/applyCoupon
// @access private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  //1)get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError(`coupon is not correct or expired`, 404));
  }
  //2) get cart based on logged user to get total price
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || !cart.cartItems.length) {
    return next(new AppError("Cart is empty", 400));
  }

  const totalPrice = cart.totalCartPrice;

  //3)calculate price after Discount
  const priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = priceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
