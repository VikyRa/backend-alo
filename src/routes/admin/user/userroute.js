const express = require('express');
const { requireSignin, adminMiddleware } = require('../../../common-middleware');
const { getcallhistory } = require('../../../controller/admin/user/callhistroy');
const { createUser } = require('../../../controller/admin/user/create');
const { deleteuser } = require('../../../controller/admin/user/delete');
const { getuser, singleuser ,userstats, astrologerstats} = require('../../../controller/admin/user/list');
const { updateuserdetails } = require('../../../controller/admin/user/update');
const { uservalidation } = require('../../../validators/admin/user/user');

const router = express.Router();
const {isRequestValidated}  = require('../../../validators/auth');


router.get('/admin/user/list',requireSignin,adminMiddleware,getuser);
router.post('/admin/user/create',uservalidation,isRequestValidated,requireSignin,adminMiddleware,createUser);
router.delete('/admin/user/delete/:id',requireSignin,adminMiddleware,deleteuser);
router.get('/admin/user/getdetail/:id',requireSignin,adminMiddleware,singleuser);
router.put('/admin/user/update/:id',isRequestValidated,requireSignin,adminMiddleware,updateuserdetails);

// CALL HISTORY ROUTE
router.get('/admin/user/callhistory/:id',isRequestValidated,requireSignin,adminMiddleware,getcallhistory);

router.get('/admin/userstate',requireSignin,adminMiddleware,userstats);

router.get('/admin/astrologer/state',requireSignin,adminMiddleware,astrologerstats);
module.exports = router;