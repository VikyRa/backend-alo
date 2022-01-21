const ErrorHander = require("../utiles/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user/user");
const Astrologer = require("../models/astrologer/astrologer");


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  
    const token = req.headers.authorization.split(" ")[1];  
    if (!token) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    } 

    const decodedData = jwt.verify(token, process.env.JWT_SCRETE);
  
    req.user = await User.findById(decodedData.id);
  
    next();
  });

  
exports.isAuthenticatedAstroloer = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];  

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SCRETE);

  req.user = await User.findById(decodedData.id);

  next();
});
  
  exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };
  