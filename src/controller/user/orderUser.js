const Order = require('../../models/admin/order/orderModel');
const Product = require('../../models/admin/product/product');
const catchAsyncErrors = require('../../common-middleware/catchAsyncErrors');
const ErrorHander = require('../../utiles/errorhander');


// Create new Order
exports.newUserOrder = catchAsyncErrors(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
      role:'user'
    });
  
    res.status(201).json({
      success: true,
      order,
    });
});

//   create order for astrologer
// Create new Order



// get Single Order
exports.getSingleUserOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});


// get logged in user  Orders
exports.myUserOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});