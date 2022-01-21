const Chat = require('../../models/chat/ChatSchema');
const User = require('../../models/user/user');
const Message = require('../../models/chat/MessageSchema');
const Notification = require('../../models/chat/NotificationSchema');
const mongoose = require('mongoose');
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");


exports.latest = async (req, res, next) => {
    Notification.find({ userTo: req.user._id, opened: false })
        .populate('userTo')
        .populate('userFrom')
        .sort({ createdAt: -1 })
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
};

 
exports.markasread = async (req, res, next) => {
    // req.params.chatId
    Notification.updateMany({ userTo: req.user._id, entityId: req.params.conversationId }, { opened: true })
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
};


// Get user list

exports.getusers = async (req, res, next) => {
    User.find({ _id: { $ne: req.user._id } }).then(function (users) {
        res.status(200).send(users);
    });

};

// Search for users

exports.searchusers = async (req, res, next) => {
    let searchObj = req.body

    if (req.body.query !== undefined) {
        searchObj = {
            $or: [
                { username: { $regex: req.body.query, $options: 'i' } }
            ]
        }
    }

    User.find(searchObj)
        .then(results => {
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400)
        })

};