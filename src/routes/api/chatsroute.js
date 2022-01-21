const express = require('express');
const { isAuthenticatedUser } = require('../../common-middleware/auth');
const { savechat, getchatlist,findChattody, getchatlistbyid,mychats,getusersumchat, getchatlistis_pendding, getchatlistis_accept, getchatlistis_complete, getchatlistbyId, endchatsession, bychatId } = require('../../controller/api/chat');
const router = express.Router();

router.post('/savechat',isAuthenticatedUser,savechat);
router.get('/chatlist',isAuthenticatedUser,getchatlist);
router.get('/chat/:chatId',isAuthenticatedUser,getchatlistbyid);
// router.get('/mychat',mychats)
router.get('/getcount/:id',getusersumchat);


// other chat list
router.get('/paddingchatlist',isAuthenticatedUser,getchatlistis_pendding);
router.get('/acceptchatlist',isAuthenticatedUser,getchatlistis_accept);
router.get('/completechatlist',isAuthenticatedUser,getchatlistis_complete);



// get user chat list by id
router.post('/getchatlistbyId',getchatlistbyId);


router.get('/findChattody',findChattody);
router.post('/endchat',isAuthenticatedUser,endchatsession);
router.get(`/getchatByid/:id`,bychatId);
module.exports = router;