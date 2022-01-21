const express = require("express");
const { registerUser, loginUser, logout, forgotPassword,updatePassword, resetPassword,getUserDetails } = require("../../controller/user/user");
const router = express.Router();
const {isAuthenticatedAstroloer,isAuthenticatedUser} =require('../../common-middleware/auth');
const { createReview, getReview } = require("../../controller/user/reviewController");
const { registerAstrologer,loginAstrologer,logoutastrologer ,singleAstrologer,updateastrologerdetails, getAstrologer, getcountchat, getRandomAstrologer} = require("../../controller/astrologer/astrologer");

router.post("/astrologer/register",registerAstrologer);
router.post('/astrologer/login',loginAstrologer);
router.post('/astrologer/logout',logoutastrologer);
router.post('/password/astrologer/forgot',forgotPassword);
router.put("/password/astrologer/reset/:token",resetPassword);

router.get('/atrologer/getdetail/:id',isAuthenticatedAstroloer,singleAstrologer);
router.put('/atrologer/update/:id',isAuthenticatedAstroloer,updateastrologerdetails);

 router.get('/astrologer/list',getAstrologer);


// router.route("/astrologer/profile").get(isAuthenticatedUser, getUserDetails);
// router.route("/astrologer/password/update").put(isAuthenticatedUser, updatePassword);
// router.post('/astrologer/review/add',createReview);
// router.get('/astrologer/review',getReview);
router.get('/astrologer/chatcount',isAuthenticatedUser,getcountchat);

router.get('/getrandomastrologer',getRandomAstrologer);
module.exports = router;