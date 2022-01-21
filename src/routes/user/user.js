const express = require("express");
const { registerUser, loginUser, logout, forgotPassword,updatePassword, resetPassword,getUserDetails, getusers, varifyotp, resendotp, updatepick, updateidproof, checkmobilenumber, forgotpasswordupdate, uploadadharcard, uploadpancard, sendemails, emailverification } = require("../../controller/user/user");
const router = express.Router();
const {isAuthenticatedUser} =require('../../common-middleware/auth');
const { createReview, getReview, createAstrolgerReview } = require("../../controller/user/reviewController");
const { paymentWallate,paymentCallback, getpayment, paymentsuccess, getallwalletamount } = require("../../controller/user/paymentController");
const { updateaccept, findChattody } = require("../../controller/api/chat");
const { upload } = require("../../common-middleware");
const { updateChatTime, firstupdateChatTime } = require("../../controller/user/chathistory");
const {updateChatStatus}=require('../../controller/api/chat');
const { newOrder, orderpaymentCallback, ordergetpayment, orderpaymentsuccess, ordercancelpayment,getorderByuser, getSingleOrder } = require("../../controller/order/orderCtroller");
router.post("/register",registerUser);
router.post('/login',loginUser);
router.get('/logout',logout);
router.post('/password/forgot',forgotPassword);
router.put("/password/reset/:token",resetPassword);

router.route("/profile").get(isAuthenticatedUser, getUserDetails);


// upload profile picks
router.post('/uploadadharcard',isAuthenticatedUser,upload.single('adhar_card'),uploadadharcard);
router.post('/uploadpancard',isAuthenticatedUser,upload.single('pan_card'),uploadpancard);

// upload profile photo
router.put('/upload/photo/:id',isAuthenticatedUser,upload.single('profilePicture'),updatepick);
router.put('/upload/idprof/:id',isAuthenticatedUser,upload.single('id_proof'),updateidproof);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.post('/review/add',createReview);
router.get('/review',getReview);
router.post('/paymentWallate',paymentWallate);

router.post("/payment/callback", paymentCallback);
router.post("/getpayment", getpayment);
router.post("/paymentsuccess", paymentsuccess);
router.post("/getallwalletamount", getallwalletamount);

router.post('/astrologer/review/add',isAuthenticatedUser,createAstrolgerReview);


router.get('/users',getusers);


// VARIFY OTP
router.put("/varifyotp/:id",varifyotp);
router.get("/resend/:id",resendotp);


router.put('/updatechatstatus/:id',updateaccept);

router.put('/updatechatamount/:id',updateChatTime);
router.put('/firstupdateChatTime/:id',firstupdateChatTime);



router.post('/createOrder',isAuthenticatedUser,newOrder);
router.post('/ordercallback',isAuthenticatedUser,orderpaymentCallback);
router.post("/ordergetpayment",isAuthenticatedUser,ordergetpayment);
router.post("/ordersucess",isAuthenticatedUser,orderpaymentsuccess);
router.post("/ordercancel",isAuthenticatedUser,ordercancelpayment);


// get user order
router.get('/user/orderlist',isAuthenticatedUser,getorderByuser);
router.get('/user/order/:id',getSingleOrder);


// forget password
router.post('/check-mobile',checkmobilenumber);

router.put('/forgotpassword/:id',forgotpasswordupdate);


// get chat total time
router.get('/totalchattime',findChattody);

// update chat status
router.post('/updatChatStatus',updateChatStatus);

router.get('/sendemail',sendemails);

router.put('/varification/:id',emailverification);

module.exports = router;