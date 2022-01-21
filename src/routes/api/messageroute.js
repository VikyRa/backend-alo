const express = require('express');
const { isAuthenticatedUser } = require('../../common-middleware/auth');
const { savechat, getchatlist, getchatlistbyid } = require('../../controller/api/chat');
const { conversationId, savemessage } = require('../../controller/api/messages');
const router = express.Router();

router.post('/savemessage',isAuthenticatedUser,savemessage);
router.get('/message/:conversationId',isAuthenticatedUser,conversationId);

module.exports = router;