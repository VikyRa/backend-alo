const User = require('../../../models/user/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");

exports.updateuserdetails = async (req, res) => {
    try {
        const updateuser = await  User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json({message:"User updated successfully ",updateuser});
    } catch (err) {
        return res.status(401).json({message:err});
    }
};