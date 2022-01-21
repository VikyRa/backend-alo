const { check, validationResult } = require('express-validator');



// user create validation
exports.uservalidation=[
    check('first_name').notEmpty().withMessage('First Name is required'),
    check('last_name').notEmpty().withMessage('Last Name is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('password').isLength({min:8}).withMessage('Password must be min 8 digit'),
    check('mobile').isLength({min:10}).withMessage('Mobile must be min 10 digit'),
];
