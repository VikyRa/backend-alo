const User = require('../../models/user/user');
const sendToken = require("../../utiles/jwtToken");
const sendEmail = require("../../utiles/sendEmail");
const crypto = require("crypto");
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
var validator = require("email-validator");
var request = require("request");


const saltRounds = 10;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Register a  User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  try {
    User.findOne({ mobile: req.body.mobile, role: 'user' }).exec((moerror, mobileuser) => {
      if (mobileuser) return res.status(400).json({
        message: "Mobile already registered"
      });
      const {
        first_name,
        last_name,
        email,
        mobile,
        password
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
                mobile: data.mobile,
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

            const message = `Dear ${first_name} ${last_name} \n\nTo finish setting up your ALO account, we just need to make sure this email address is yours. To verify your email address click this link ${process.env.FONT_URL}email-verification/${data._id} If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
            \nThanks,\nThe ALO team`;

              sendEmail({
                email: email,
                subject: `ALO Email Verification`,
                message,
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
    return res.status(400).json({ error: err });
  }
});

exports.sendemails= async (req,res)=>{
 await sendEmail({
    email: 'bk7899189@gmail.com',
    subject: `Email Verification`,
    message:'hellow',
  });
 return res.status(200).json({
    success: true,
    message: `Email sent to  successfully`,
  });
} 



// VARIFY OTP
exports.varifyotp = catchAsyncErrors(async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });
    sendToken(data, 201, res);
  } catch (err) {
    return res.status(401).json({ message: err });
  }
});

// email varification
exports.emailverification = catchAsyncErrors(async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });
    sendToken(data, 201, res);
  } catch (err) {
    return res.status(401).json({ message: err });
  }
});


exports.resendotp = catchAsyncErrors(async (req, res, next) => {
  try {

    const data = await User.findById(req.params.id);
    var options = {
      method: 'GET',
      url: 'http://nimbusit.info/api/pushsms.php',
      qs:
      {
        user: '105079',
        key: '010Jj5UN50SworTG4YrD',
        sender: 'PWBTCH',
        mobile: data.mobile,
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
          success:false
        })
      }
      return res.status(201).json({
        message: "Otp send successfully",
        users: data,
        success:true
      })
    });

  } catch (err) {
    return res.status(401).json({ message: err });
  }
});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { mobile, password } = req.body;

  // checking if user has given password and email both

  if (!mobile || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ mobile: mobile, role: 'user' }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

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
        mobile: data.mobile,
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
      // return res.status(201).json({
      //   message: "Otp send successfully",
      //   users: data,
      //   is_vairy,
      // })
      console.log(body);
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

});


// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {

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




// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Email Verification`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});




// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});





// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});




// GET PRODUCT FOR WEBSITE 
exports.getusers = catchAsyncErrors(async (req, res, next) => {

  const resultPerPage = 10;
  const userCount = await User.countDocuments();

  const apiFeature = new Astrologerapi(User.find(), req.query)
    .search()
    .filter();

  let users = await apiFeature.query;

  let filtereduserCount = users.length;

  apiFeature.pagination(resultPerPage);

  users = await apiFeature.query;

  res.status(200).json({
    success: true,
    users,
    userCount,
    resultPerPage,
    filtereduserCount,
  });
});




exports.updateidproof = async (req, res) => {
  // const bannerObj = {
  //   id_proof = "/public/" + req.file.filename
  // };

  const bannerObj = {};
  if (req.file) {
    bannerObj.id_proof = "/public/" + req.file.filename
  }
  try {
    const data = await User.findByIdAndUpdate(req.params.id, bannerObj, { new: true });
    res.status(200).json({
      message: 'Profile updated successfully'
    });
  } catch (err) {
    return res.status(401).json({ message: err });
  }

}


exports.updatepick = async (req, res) => {
  const bannerObj = {};
  if (req.file) {
    bannerObj.profilePicture = "/public/" + req.file.filename
  }

  try {
    const data = await User.findByIdAndUpdate(req.params.id, bannerObj, { new: true });
    res.status(200).json({
      message: 'Profile updated successfully',
      user: data
    });
  } catch (err) {
    return res.status(401).json({ message: err });
  }

}




// FORGET PASSOWRD WITH OTP 
// CHECK MOBILE NUMBER EXIST OR NOT

exports.checkmobilenumber = catchAsyncErrors(async (req, res, next) => {
  const { mobile ,role } = req.body;
  // checking if user has given password and email both

  if (!mobile) {
    return next(new ErrorHander("Mobile Number can not empty", 400));
  }

  const user = await User.findOne({ mobile: mobile,role:role })
    .then(async (result) => {
      // const data = await User.findById(req.params.id);
      var mobileotps = Math.floor(1000 + Math.random() * 9000);
      await User.findByIdAndUpdate(result._id, {
        $set: { mobileotp: mobileotps }
      }, { new: true })
        .then((data) => {
          var options = {
            method: 'GET',
            url: 'http://nimbusit.info/api/pushsms.php',
            qs:
            {
              user: '105079',
              key: '010Jj5UN50SworTG4YrD',
              sender: 'PWBTCH',
              mobile: data.mobile,
              text: `Dear Customer, Your OTP for xyz.com is ${data.mobileotp}. Use this Passcode to complete your transaction/registration/verification. Thank you. Secured by Paridhi Webtech`,
              entityid: '1701163221218912125',
              templateid: '1707163280441910626'
            },
            headers:
            {
              'postman-token': 'f4b48a43-6dcf-bf14-0003-d005d1819341',
              'cache-control': 'no-cache'
            }

          }
          
          request(options, function (error, response, body) {
            if (error) console.log(error);

            console.log(body);
          });
          return res.status(200).json({
            success: true,
            message: 'Otp send your register mobile number',
            user: data
          });
        }).catch((err) => {
          return res.status(401).json({
            success: false,
            message: 'Some thing went worng',
          });
        })

    }).catch((error) => {
      return res.status(401).json({
        success: false,
        message: 'Mobile Number does not exist this system',
      });
    })


});


// update password
exports.forgotpasswordupdate = catchAsyncErrors(async (req, res, next) => {
  try {
    const datas={
      password : await bcrypt.hash(req.body.password, 10)
    };
    // bcrypt.hash(req.body.password, 10).then((password) => {
    //   datas.password = password
    // })

    const data = await User.findByIdAndUpdate(req.params.id, datas, { new: true });
    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    return res.status(401).json({ message: err });
  }
});



// upload adhar card and pan card
exports.uploadadharcard = async (req, res) => {
  const bannerObj = {};
  if (req.file) {
    bannerObj.adhar_card = "/public/" + req.file.filename
  }

  try {
    const data = await User.findByIdAndUpdate(req.user._id, bannerObj, { new: true });
    res.status(200).json({
      message: 'Adhar card updated successfully',
      user: data
    });
  } catch (err) {
    return res.status(401).json({ message: err });
  }

}


exports.uploadpancard = async (req, res) => {
  const bannerObj = {};
  if (req.file) {
    bannerObj.pancard = "/public/" +req.file.filename
  }

  try {
    const data = await User.findByIdAndUpdate(req.user._id, bannerObj, { new: true });
    res.status(200).json({
      message: 'Pan card updated successfully',
      user: data
    });
  } catch (err) {
    return res.status(401).json({ message: err });
  }

}