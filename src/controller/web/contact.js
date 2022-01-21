
const sendToken = require("../../utiles/jwtToken");
const sendEmail = require("../../utiles/sendEmail");
const crypto = require("crypto");
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
var validator = require("email-validator");
const Contact = require('../../models/admin/contact');



// Register a  User
exports.createContact = catchAsyncErrors(async (req, res, next) => {
    try {

          const {
            name,
            email,
            mobile,
            message
          } = req.body;
          if (name == '') {
            return res.status(400).json({
              message: " Name is required"
            });
          } else if (email == '' || email === null) {
            return res.status(400).json({
              message: "Email is required"
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
            const _user = new Contact({
                name,
                email,
                mobile,
                message
            });
            _user.save((error, data) => {
              if (error) {
                return res.status(400).json({
                  message: "Something went worng",
                  errors: error.message
                })
              }
              if (data) {
                return  res.status(201).json({
                    message: "Thanks for enquiry"
                  })
              }
            });
          }

    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });
  