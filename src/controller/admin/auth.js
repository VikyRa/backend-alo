const Admin = require("../../models/admin/admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const shortid = require('shortid');
const Role = require('../../models/admin/role');


exports.signup = (req, res) => {
    Admin.findOne({ email: req.body.email }).exec((error, user) => {
        if (user) return res.status(400).json({
            message: "Email already registered"
        });
        const roleObject = {
            name,
            email,
            mobile
        } = req.body;
        // if(req.body.role_id){
        //     roleObject.parentId = req.body.role_id;
        // }
        if(req.body.name){
            roleObject.username= shortid.generate()
        }
        bcrypt.hash(req.body.hash_password, 10).then((hash_password) => {
            if(req.body.hash_password){
                roleObject.hash_password= hash_password
            }
            const _admin = new Admin(roleObject);

            _admin.save((error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: "Something went worng",
                        errors: error
                    })
                }
                if (data) {
                    return res.status(201).json({
                        message: "User registered succesfully",
                        user: data
                    })
                }
            });
        });
    });
}

// SIGN IN FUNCTION START
exports.signin = (req, res) => {
    Admin.findOne({ email: req.body.email })
        .exec(async(error, data) => {
            if (error) return res.status(400).json({ message: error });
            if (data) {
                const isPassword = await data.authenticate(req.body.hash_password);
                if (isPassword) {
                   
                    // const role_names = await Role.findOne({_id: data.role_id});
                    // const role_name =role_names.role_name;
                    const {  
                        _id,
                        name,
                        email,
                        mobile,
                        username,
                        hash_password,
                        role
                         } = data;
                    
                    const token = jwt.sign({ _id: data._id,role }, process.env.JWT_SCRETE, { expiresIn: '8h' });
                   
                    res.cookie('token',token,{expiresIn: '8h'});
                    res.status(200).json({
                        token,
                        userdata: {
                            name,
                            email,
                            username,
                            mobile,
                            role
                        }
                    });
                } else {
                    return res.status(400).json({ message: "Invailed login credentials" });
                }
            } else {
                return res.status(400).json({ message: "Email address does not exist !" });
            }
        })
}


// SIGNOUT FUNCTION START]
exports.signout = (req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({ message: "Signout successfully...!" });
}