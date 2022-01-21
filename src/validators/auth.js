const { check, validationResult } = require('express-validator');


exports.validateRequestSignup=[
    check('name').notEmpty().withMessage('Name is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('hash_password').isLength({min:6}).withMessage('Password must be min 6 digit'),
    check('mobile').isLength({min:10}).withMessage('Mobile must be min 6 digit'),
];



exports.validateRequestSignin=[
    check('email').isEmail().withMessage('Email is required'),
    check('hash_password').isLength({min:8}).withMessage('Password must be min 6 digit')
];

exports.validateRequestService=[
    check('service_name').notEmpty().withMessage('Service is required'),
    check('short_description').notEmpty().withMessage('Short Description is required'),
    check('long_description').notEmpty().withMessage('Long Description is required'),
    check('status').notEmpty().withMessage('status is required'),
    
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({ message: errors.array()[0].msg })
    }
    next();
}