const express = require('express');
const { isAuthenticatedUser } = require('../../common-middleware/auth');
const { latest, markasread, getusers, searchusers } = require('../../controller/api/notifications');

const router = express.Router();

router.get('/latest',isAuthenticatedUser,latest);
router.put('/markasread/:conversationId',isAuthenticatedUser,markasread);
router.get('/getusers',isAuthenticatedUser,getusers);
router.post('/searchusers',isAuthenticatedUser,searchusers);



module.exports = router;