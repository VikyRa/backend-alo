const User = require('../../models/user/user');
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
const Wallateamount = require('../../models/user/wallatamount');
let orderId;

// var instance = new Razorpay({
//     key_id: process.env.KEY_ID,
//     key_secret: process.env.SECREAT_KEY,
//   });
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECREAT_KEY,
});


exports.paymentWallate = async (req, res) => {
  try {
    const amount = req.body.amount;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const name = req.body.name;
    const userId = req.body.userId;
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: uniquId(),
    };



    const order = await instance.orders.create(options);
    const _user = new Wallateamount({
      userId: userId,
      amount: amount,
      order_id: order.id,
      email: email,
      name: name
    });
    _user.save();
    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};


// paymentCallback




exports.paymentCallback = (req, res) => {
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


exports.getpayment = catchAsyncErrors(async (req, res, next) => {

  const { data, orderId } = req.body;

  const updatedata = {
    payment_status: data.status,
    razarpayid: data.id,
    transaction_date: data.created_at,
    all_data: data
  }
  //   console.log(updatedata);
  const ord = await Wallateamount.findOneAndUpdate({ order_id: orderId }, updatedata);
  const {userId,amount} =ord;

 const userdata =  await User.findById(userId);
 const walletamounts = parseInt(userdata.walletamount) + parseInt(amount);
 await User.findOneAndUpdate({_id:userId}, {walletamount:walletamounts}, { new: true });

  res.status(200).send(ord);

});


exports.cancelpayment = catchAsyncErrors(async (req, res, next) => {

  const { orderId } = req.body;

  const updatedata = {
    payment_status: data.status,
    razarpayid: data.id,
    transaction_date: data.created_at,
    all_data: data
  }
  //   console.log(updatedata);
  const ord = await Wallateamount.findOneAndUpdate({ order_id: orderId }, updatedata);

  res.status(200).send(ord);

});

exports.paymentsuccess = catchAsyncErrors(async (req, res, next) => {

  const { orderId } = req.body;

  //   console.log(updatedata);
   await Wallateamount.findOne({ order_id: orderId })
    .then(item => {
      res.status(201).json({ item });
    }).catch(err => {
      res.status(400).send({ err });
    });

});



// get all wallet record
exports.getallwalletamount =  catchAsyncErrors(async (req, res, next) => {

  const { userId } = req.body;

  //   console.log(updatedata);
   await Wallateamount.find({ userId: userId })
    .then(result => {
      res.status(201).json({ result });
    }).catch(err => {
      res.status(400).send({ err });
    });

});