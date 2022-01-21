const Chat = require('../../models/chat/ChatSchema');
const User = require('../../models/user/user');
const Message = require('../../models/chat/MessageSchema');
const Notification = require('../../models/chat/NotificationSchema');
const mongoose = require('mongoose');
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");


//  Get messages from conversation by Id
exports.conversationId = async (req, res, next) => {
    Message.find({ chat: req.params.conversationId })
    .populate('sender')
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

};


//  Create a new message


function insertNotifications(chat, message, req) {
    chat.users.forEach(userId => {
        if (JSON.stringify(userId) === JSON.stringify(message.sender._id)) return;

        req.io.sockets.to(userId).emit('notification received', "hey")
        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id)
    })
}

exports.savemessage = async (req, res, next) => {

    if (!req.body.content || !req.body.conversationId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }

    let newMessage = {
        sender: req.user._id,
        content: req.body.content,
        chat: req.body.conversationId
    }


    Message.create(newMessage)
        .then(async message => {
            message = await message.populate('sender').execPopulate();
            message = await message.populate('chat').execPopulate();

            let chat = await Chat.findByIdAndUpdate(req.body.conversationId, { latestMessage: message }).then(results => {
                for (const pair of req.onlineUsers) {
                    if (results.users[0].toString() === pair.value) {
                        req.io.sockets.to(pair.key).emit('message received', newMessage)
                    }
                    if (results.users[1].toString() === pair.value) {
                        req.io.sockets.to(pair.key).emit('message received', newMessage)
                    }
                }
                return results
            })
                .catch(error => console.log(error))

            insertNotifications(chat, message, req)

            res.status(201).send(message);
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
};