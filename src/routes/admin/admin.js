const express = require('express');
const { check }  = require('express-validator');
const {validateRequestSignup,validateRequestSignin,isRequestValidated}  = require('../../validators/auth');
const router = express.Router();
const bcrypt = require('bcrypt');
const { signup, signin, requireSignin ,signout} = require('../../controller/admin/auth');

router.post('/admin/signin',validateRequestSignin,isRequestValidated, signin);

router.post('/admin/signup',validateRequestSignup,isRequestValidated, signup);
// PROFILE ROUTE
router.post('/admin/signout',validateRequestSignin,signout);


module.exports = router;