const Order = require('../../models/admin/order/orderModel');
const Product = require('../../models/admin/product/product');


require("dotenv").config();
const sendToken = require("../../utiles/jwtToken");
const sendEmail = require("../../utiles/sendEmail");
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
var validator = require("email-validator");
const uniquId = require("uniqid");
const path = require("path");
const Formidable = require("formidable");
const crypto = require("crypto");
const request = require("request");
const Razorpay = require("razorpay");


// Create new Order

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate(
    "user",
    "first_name email mobile"
  ).sort({ createdAt: -1 });

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// get spesfic order

// update Order Status -- Admin
exports.getorderDetailById = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate(
      "user",
      "first_name email mobile"
    ).then((result)=>{
      res.status(200).json({
        success: true,
        orderDetail:result
      });
    }).catch((err)=>{
      res.status(401).json({
        success: true,
        error:err
      });
    });
  
});



// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.quantity -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});


const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECREAT_KEY,
});
// CREATE NEW ORDER 

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    shippingCharges
  } = req.body;

  const orderNumber = Math.floor((Math.random() * 100000) + 1);

  const options = {
    amount: totalPrice * 100, // amount in smallest currency unit
    currency: "INR",
    receipt: uniquId(),
  };

  const order = await instance.orders.create(options);

  const orders = await Order({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    shippingCharges,
    orderNumber,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
    paymentorderid: order.id
  });
  orders.save();
  if (!order) return res.status(500).send("Some error occured");

  return res.json(order);

});





exports.orderpaymentCallback = (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.SECREAT_KEY);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature) {
      return res.status(400).json({ msg: "Transaction not legit!" });
    } else {
      // THE PAYMENT IS LEGIT & VERIFIED
      // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
      request(`https://${process.env.KEY_ID}:${process.env.SECREAT_KEY}@api.razorpay.com/v1/payments/${razorpayPaymentId}`, function (error, response, body) {
        // const datas=  JSON.stringify(body);
        const result = JSON.parse(body);


        res.json({
          msg: "success",
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          data: result
        });
      });

    }



  } catch (error) {
    res.status(500).send(error);
  }
}


exports.ordergetpayment = catchAsyncErrors(async (req, res, next) => {

  const { data, orderId } = req.body;

  const updatedata = {
    payment_status: data.status,
    razarpayid: data.id,
    transaction_date: data.created_at,
    all_data: data,
    orderStatus: 'confirm',

  }
  //   console.log(updatedata);
  const ord = await Order.findOneAndUpdate({ paymentorderid: orderId }, updatedata);

  return res.status(200).send(ord);

});


exports.ordercancelpayment = catchAsyncErrors(async (req, res, next) => {

  const { orderId } = req.body;

  const updatedata = {
    payment_status: 'cancel',
    razarpayid: data.id,
    transaction_date: data.created_at,
    all_data: data,
    orderStatus: 'pending',
  }
  //   console.log(updatedata);
  const ord = await Order.findOneAndUpdate({ order_id: orderId }, updatedata);

  res.status(200).send(ord);

});

exports.orderpaymentsuccess = catchAsyncErrors(async (req, res, next) => {

  const { orderId } = req.body;

  //   console.log(updatedata);
  await Order.findOne({ paymentorderid: orderId })
    .then(item => {
      res.status(201).json({ item });
    }).catch(err => {
      res.status(400).send({ err });
    });

});



// get order by user
exports.getorderByuser = catchAsyncErrors(async (req, res, next) => {
  //   console.log(updatedata);
  await Order.find({ user: req.user._id })
    .then(item => {
      res.status(201).json({ item });
    }).catch(err => {
      res.status(400).send({ err });
    });

});


// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id }).populate(
    "user",
    "first_name email mobile"
  );
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});



exports.orderStates = async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
  ];
  await Order.aggregate([
          {
              $project:{
                  month:{ $month : "$createdAt"},
              }
          },
          {
              $group:{
                  _id:"$month",
                  total:{$sum:1}
              }
          } 
      ])  .then(order => {
          res.status(200).json(order);
      }).catch(err => {
          res.status(400).send({ err });
      });
 

}