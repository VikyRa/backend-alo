const User = require('../../../models/user/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");


exports.createUser = async (req, res) => {
    try {

            User.findOne({ mobile: req.body.mobile,role:'user' }).exec((moerror, mobileuser) => {
                if (mobileuser) return res.status(400).json({
                    message: "Mobile already registered"
                });
                const {
                    first_name,
                    last_name,
                    email,
                    mobile,
                    gender,
                    password,
                    role
                } = req.body;
                if (first_name == '') {
                    return res.status(400).json({
                        message: "First Name is required"
                    });
                } else if (last_name == '' || last_name === null) {
                    return res.status(400).json({
                        message: "Last Name is required"
                    });
                } else if (email == '' || email === null) {
                    return res.status(400).json({
                        message: "Email is required"
                    });
                } else if (gender == '' || gender === null) {
                    return res.status(400).json({
                        message: "Gender is required"
                    });
                } else if (password == '' || password === null) {
                    return res.status(400).json({
                        message: "Password is required"
                    });
                } else if (mobile == '' || mobile === null) {
                    return res.status(400).json({
                        message: "Mobile is required"
                    });
                } else if (!validator.validate(email)) {
                    return res.status(400).json({
                        message: "Email is invalid"
                    });
                } else {

                    bcrypt.hash(req.body.password, 10).then((password) => {
                        const _user = new User({
                            first_name,
                            last_name,
                            email,
                            mobile,
                            gender,
                            password,
                            role
                        });
                        _user.save((error, data) => {
                            if (error) {
                                return res.status(400).json({
                                    message: "Something went worng",
                                    errors: error.message
                                })
                            }
                            if (data) {
                                return res.status(201).json("User added succesfully")
                            }
                        });
                    });
                }
            });
    } catch (err) {
        return res.status(400).json({ error: err });
    }
}