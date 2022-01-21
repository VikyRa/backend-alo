const Astrologer = require('../../models/astrologer/astrologer');
const sendToken = require("../../utiles/jwtToken");
const sendEmail = require("../../utiles/sendEmail");
const crypto = require("crypto");
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
var validator = require("email-validator");
const Astrologerapi = require('../../utiles/astrologerapi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const User = require('../../models/user/user');
var request = require("request");
const Chat = require('../../models/chat/ChatSchema');








// Register a  User
exports.registerAstrologer = catchAsyncErrors(async (req, res, next) => {
    try {
        User.findOne({ mobile: req.body.mobile, role: 'astrologer' }).exec((moerror, mobileuser) => {
            if (mobileuser) return res.status(400).json({
                message: "Mobile already registered"
            });
            const {
                first_name,
                last_name,
                email,
                mobile,
                password,
                address,
                suitable_time_interview,
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
            } else if (password == '' || password === null) {
                return res.status(400).json({
                    message: "Password is required"
                });
            } else if (mobile == '' || mobile === null) {
                return res.status(400).json({
                    message: "Mobile is required"
                });
            } else {
                var mobileotp = Math.floor(1000 + Math.random() * 9000);
                const _user = new User({
                    first_name,
                    last_name,
                    email,
                    mobile,
                    password,
                    address,
                    suitable_time_interview,
                    role,
                    mobileotp
                });
                _user.save((error, data) => {
                    if (error) {
                        return res.status(400).json({
                            message: "Something went worng",
                            errors: error.message
                        })
                    }
                    if (data) {

                        var options = {
                            method: 'GET',
                            url: 'http://nimbusit.info/api/pushsms.php',
                            qs:
                            {
                                user: '105079',
                                key: '010Jj5UN50SworTG4YrD',
                                sender: 'PWBTCH',
                                mobile: mobile,
                                text: `Dear Customer, Your OTP for xyz.com is ${mobileotp}. Use this Passcode to complete your transaction/registration/verification. Thank you. Secured by Paridhi Webtech`,
                                entityid: '1701163221218912125',
                                templateid: '1707163280441910626'
                            },
                            headers:
                            {
                                'postman-token': 'f4b48a43-6dcf-bf14-0003-d005d1819341',
                                'cache-control': 'no-cache'
                            }
                        };

                        request(options, function (error, response, body) {
                            if (error) console.log(error);

                            console.log(body);
                        });
                        return res.status(201).json({
                            message: "User register successfully",
                            user: data
                        })
                        // sendToken(data, 201, res);
                    }
                });
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});


// Login User
exports.loginAstrologer = catchAsyncErrors(async (req, res, next) => {
    const { mobile, password } = req.body;

    // checking if user has given password and email both

    if (!mobile || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ mobile: mobile, role: 'astrologer' }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
    req.session.user = await User.findById(user._id).select('+password');
    // sendToken(user, 200, res);

    await User.findByIdAndUpdate(user._id, {
        $set: {is_online:'1'}
    }, { new: true });

    if (user.is_mobile_varify === 1) {

        req.session.user = await User.findById(user._id).select('+password');
        // sendToken(user, 200, res);
        const token = user.getJWTToken();

        // options for cookie
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        const is_vairy = true;

        return res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
            is_vairy
        });
    } else {
        // const data = await User.findById(req.params.id);
        var mobileotps = Math.floor(1000 + Math.random() * 9000);

        const data = await User.findByIdAndUpdate(user._id, {
            $set: { mobileotp: mobileotps }
        }, { new: true });
        var options = {
            method: 'GET',
            url: 'http://nimbusit.info/api/pushsms.php',
            qs:
            {
                user: '105079',
                key: '010Jj5UN50SworTG4YrD',
                sender: 'PWBTCH',
                mobile: mobileotp,
                text: `Dear Customer, Your OTP for xyz.com is ${data.mobileotp}. Use this Passcode to complete your transaction/registration/verification. Thank you. Secured by Paridhi Webtech`,
                entityid: '1701163221218912125',
                templateid: '1707163280441910626'
            },
            headers:
            {
                'postman-token': 'f4b48a43-6dcf-bf14-0003-d005d1819341',
                'cache-control': 'no-cache'
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                return res.status(401).json({
                    message: "Otp can not sent",
                })
            }
            const token = user.getJWTToken();

            // options for cookie
            const options = {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            };
            const is_vairy = false;

            return res.status(200).cookie("token", token, options).json({
                success: true,
                user: data,
                token,
                is_vairy
            });
        });
    }


    // const token = user.getJWTToken();

    // // options for cookie
    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    // };

    // return res.status(200).cookie("token", token, options).json({
    //     success: true,
    //     user,
    //     token,
    // });
});



// Logout User
exports.logoutastrologer = catchAsyncErrors(async (req, res, next) => {
    await User.findByIdAndUpdate(req.body._id, {
        $set: {is_online:'0'}
    }, { new: true });
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    req.session = null
    res.clearCookie('userId')
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

//   get single records
exports.singleAstrologer = async (req, res) => {
    try {
        const result = await User.findById(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
}



// update
exports.updateastrologerdetails = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true }).then(updateuser => {
        res.status(200).json({ message: "User updated successfully ", updateuser });
    }).catch(err => {
        res.status(400).send({ err });
    });

};



// GET PRODUCT FOR WEBSITE 
exports.getAstrologer = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 10;
    const astrologerCount = await User.countDocuments();

    const apiFeature = new Astrologerapi(User.find({ role: 'astrologer', isactive: '1' }), req.query)
        .search()
        .filter();

    let astrologers = await apiFeature.query;

    let filteredAstrologerCount = astrologers.length;

    apiFeature.pagination(resultPerPage);

    astrologers = await apiFeature.query;

    res.status(200).json({
        success: true,
        astrologers,
        astrologerCount,
        resultPerPage,
        filteredAstrologerCount,
    });
});



// get data count
exports.getcountchat = async (req, res, next) => {
    const time = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        total: 0,

        dailyuser: 0,
        weeklyuser: 0,
        monthlyuser: 0,
        totaluser: 0,
    }
    try {
        await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } },
            async function (err, found) {

                await found.map((item) => {
                    // daily
                    if ((parseInt(item.createdAt.getDate()) === parseInt(new Date().getDate())) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.daily += parseInt(item.total_time);
                        time.dailyuser += 1;

                    }
                    // week
                    if ((Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate())) < 7) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.weekly += parseInt(item.total_time);
                        time.weeklyuser += 1;
                    }
                    // month
                    if ((Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate())) < 30) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.monthly += parseInt(item.total_time);
                        time.monthlyuser += 1;
                    }
                    time.total += parseInt(item.total_time);
                    time.totaluser += 1;
                })
            })
            
    res.status(200).json({
        success: true,
        time
    });
    } catch (error) {
        res.status(401).json({
            success: false,
            error:error
        });
    }

}




// get all count for chat
exports.getallcountchat = async (req, res, next) => {
    const time = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        total: 0,

        dailyuser: 0,
        weeklyuser: 0,
        monthlyuser: 0,
        totaluser: 0,
    }
    try {
        await Chat.find(
            async function (err, found) {

                await found.map((item) => {
                    // daily
                    if ((parseInt(item.createdAt.getDate()) === parseInt(new Date().getDate())) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.daily += parseInt(item.total_time);
                        time.dailyuser += 1;

                    }
                    // week
                    if ((Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate())) < 7) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.weekly += parseInt(item.total_time);
                        time.weeklyuser += 1;
                    }
                    // month
                    if ((Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate())) < 30) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                        time.monthly += parseInt(item.total_time);
                        time.monthlyuser += 1;
                    }
                    time.total += parseInt(item.total_time);
                    time.totaluser += 1;
                })
            })
            
    res.status(200).json({
        success: true,
        time
    });
    } catch (error) {
        res.status(401).json({
            success: false,
            error:error
        });
    }

}

exports.getRandomAstrologer = async (req, res) => {
    try {
        const result = await User.find({ role: 'astrologer', isactive: '1' },[{ $sample: { size: 1 } }]).limit(1);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
}