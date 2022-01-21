const Callhistory = require('../../models/user/call_history');
const User = require('../../models/user/user');
const Chat = require('../../models/chat/ChatSchema');

exports.updateChatTime = async (req, res) => {
    try {
        const { userId, astrologerId } = req.body;
        const chatId = req.params.id;
        const user = await User.findById(userId);
        const astrologer = await User.findById(astrologerId);
        const chat = await Chat.findById(chatId);
        if (astrologer.per_hours_charge < user.walletamount) {
            const newtime = parseInt(chat.total_time) + 1;
            const updatedata ={
                total_time:newtime
            }
            const update = await Chat.findByIdAndUpdate({ _id: chatId }, updatedata, { new: true });
            // update user amount
            const newAmount = parseInt(user.walletamount) - parseInt(astrologer.per_hours_charge);
            const userupdatedata ={
                walletamount:newAmount
            }
        //    console.log('jell');
            const userupdate = await User.findByIdAndUpdate({ _id: userId }, userupdatedata, { new: true });
            return res.status(200).json({
                message: 'Munites updated successfully',
                is_update: '1',
                chatdat: update
            });
        } else {
            // console.log('jell3');
            const updatedata = {
                is_complete: '1'
            }
            const update = await Chat.findByIdAndUpdate({ _id: chatId }, updatedata, { new: true });
           
            return res.status(200).json({
                message: 'Your wallet amount is low ! Session time out',
                is_update: '2',
                chatdat: update
            });
        }

    } catch (error) {
        return res.status(400).json({ error: error });
    }
}


exports.firstupdateChatTime = async (req, res) => {
    try {
        const { userId, astrologerId } = req.body;
        const chatId = req.params.id;
        const user = await User.findById(userId);
        const astrologer = await User.findById(astrologerId);
        const chat = await Chat.findById(chatId);
        if (astrologer.per_hours_charge < user.walletamount) {
            const newtime = parseInt(chat.total_time) + 1;
            const updatedata ={
                total_time:newtime,
                is_first_dedecat:1,
                per_minute_charge:parseInt(astrologer.per_hours_charge)
            }
            const update = await Chat.findByIdAndUpdate({ _id: chatId }, updatedata, { new: true });
            // update user amount
            const newAmount = parseInt(user.walletamount) - parseInt(astrologer.per_hours_charge);
            const userupdatedata ={
                walletamount:newAmount
            }
        //    console.log('jell');
            const userupdate = await User.findByIdAndUpdate({ _id: userId }, userupdatedata, { new: true });
            return res.status(200).json({
                message: 'Munites updated successfully',
                is_update: '1',
                chatdat: update
            });
        } else {
            // console.log('jell3');
            const updatedata = {
                is_complete: '1'
            }
            const update = await Chat.findByIdAndUpdate({ _id: chatId }, updatedata, { new: true });
           
            return res.status(200).json({
                message: 'Your wallet amount is low ! Session time out',
                is_update: '2',
                chatdat: update
            });
        }

    } catch (error) {
        return res.status(400).json({ error: error });
    }
}
