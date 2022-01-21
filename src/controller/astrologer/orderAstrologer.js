const Order = require('../../models/admin/order/orderModel');
const Product = require('../../models/admin/product/product');
const catchAsyncErrors = require('../../common-middleware/catchAsyncErrors');
const ErrorHander = require('../../utiles/errorhander');



exports.newAstrologerOrder = catchAsyncErrors(async (req, res, next) => {
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
      astrologer: req.user._id,
      role:'astrologer'
    });
  
    res.status(201).json({
      success: true,
      order,
    });
  });

// get Single Order
exports.getSingleastrologerOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "astrologer"
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
exports.myastrologerOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ astrologer: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  });