const User = require('../../../models/user/user');
const bcrypt = require('bcrypt');
var validator = require("email-validator");
const jwt = require('jsonwebtoken');

exports.getAstrologer = async (req,res)=>{
             await User.find({role:'astrologer'})  
            .then(result => {
                res.status(200).json({user:result});
            }).catch(err => {
                res.status(400).send({ error:err });
            });
} 

exports.singleAstrologer = async (req,res)=>{
    try{
        const result = await User.findById(req.params.id);
        // console.log(result);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json({error:error});
    }
} 


exports.createAstrologer = async (req, res) => {
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



exports.deleteastrologer = async (req,res)=>{
    try{
        if(req.params.id =='' || req.params.id == null){
            res.status(400).json({message:"Some thing went wong"});
        }else{
            await  User.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Astrologer delete successfully "});
        }
       
    }catch(err){
        res.status(401).json({error:err});
    }
}


exports.updateastrologerdetails = async (req, res) => {
   await  User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true}).then(updateuser => {
            res.status(200).json({message:"Astrologer updated successfully ",updateuser});
        }).catch(err => {
            res.status(400).send({ err });
        });
        
};