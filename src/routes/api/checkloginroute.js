const express = require('express');
const { isAuthenticatedUser } = require('../../common-middleware/auth');
const { checklogin, loginuser } = require('../../controller/api/logincheck');

const router = express.Router();

router.get('/checklogin',isAuthenticatedUser,checklogin);
router.post('/chatlogin',loginuser);


module.exports = router;