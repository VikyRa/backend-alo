const express = require('express');
const router = express.Router();
const { create_role, getallrole, singlerole, deleteRole, updateRole } = require('../../controller/admin/role');
const {validateRequestSignup,validateRequestSignin,isRequestValidated}  = require('../../validators/auth');
const { requireSignin, adminMiddleware } = require('../../common-middleware');


router.post('/admin/create-role',isRequestValidated,requireSignin,adminMiddleware,create_role);

router.get('/admin/get-role',isRequestValidated,requireSignin,adminMiddleware,getallrole);

router.put('/admin/role-update/:id',isRequestValidated,requireSignin,adminMiddleware,updateRole);

router.delete('/admin/role-delete/:id',isRequestValidated,requireSignin,adminMiddleware,deleteRole);

router.get('/admin/single-role/:id',isRequestValidated,requireSignin,adminMiddleware,singlerole);

module.exports = router;