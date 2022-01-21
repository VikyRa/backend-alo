const Chat = require('../../models/chat/ChatSchema');
const User = require('../../models/user/user');
const Message = require('../../models/chat/MessageSchema');
const Notification = require('../../models/chat/NotificationSchema');
const mongoose = require('mongoose');
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


exports.checklogin = async (req, res, next) => {
    // if (req.session.user) {
    //     res.send({ loggedIn: true, user: req.session.user })
    // } else {
    //     res.send({ loggedIn: false, user: req.session.user })
    // }
    if (req.user) {
        res.send({ loggedIn: true, user: req.user })
    } else {
        res.send({ loggedIn: false, user: req.user })
    }
    res.status(200)
};

exports.loginuser = async (req, res, next) => {
    var payload = req.body;

    if (req.body.mobile && req.body.password) {
        let user = await User.findOne({
            mobile: req.body.mobile
        })
            .catch((error) => {
                console.log(error)
                payload.errorMessage = "Something went wrong.";
                return res.status(401).send({
                    error: error,
                    message: payload.errorMessage,
                });
            });

        if (user !== null) {
            // console.log(user);
            const myuser = await User.findById(user._id).select('+password');
            let result = await bcrypt.compare(req.body.password, myuser.password)

            if (result === true) {
                req.session.user = user
                return res.json({})
            }
        }
        payload.errorMessage = "Login credentials incorrect.";
        return res.status(401).send({
            message: payload.errorMessage,
        });
    }
    payload.errorMessage = "Make sure each field has a valid value.";
    return res.status(401).send({
        message: payload.errorMessage,
    });
}