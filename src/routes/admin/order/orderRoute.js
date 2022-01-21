const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../../common-middleware');
const { getAllOrders, updateOrder, deleteOrder, getorderDetailById, orderStates } = require("../../../controller/order/orderCtroller");
const { getSingleastrologerOrder, newAstrologerOrder } = require("../../../controller/astrologer/orderAstrologer");
const { getSingleUserOrder, newUserOrder } = require("../../../controller/user/orderUser");
const { isAuthenticatedAstroloer, isAuthenticatedUser } = require("../../../common-middleware/auth");
const { getgrapdata } = require("../../../controller/order/orderGraph");


// FOR ADMIN ROUTE
router.get('/admin/allorder',requireSignin,adminMiddleware,getAllOrders);
router.put('/admin/order/update/:id',requireSignin,adminMiddleware,updateOrder);
router.delete('/admin/order/delete/:id',requireSignin,adminMiddleware,deleteOrder);

// FOR ASTROLOGER ROUTE
router.post('/astrologer/order',isAuthenticatedAstroloer,newAstrologerOrder);
router.get('/admin/order/astrologer/:id',getSingleastrologerOrder);

// FOR USER ROUTE
router.post('/user/order',isAuthenticatedUser,newUserOrder);
router.get('/admin/order/user/:id',getSingleUserOrder);
router.get('/order/detail/:id',getorderDetailById);


router.get('/orderstate',orderStates);

router.get('/getordergraph',getgrapdata);

module.exports = router;