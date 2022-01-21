const Role = require("../../models/admin/role");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const shortid = require('shortid');


exports.create_role = (req, res) => {
    Role.findOne({ role_name: req.body.role_name }).exec((error, role) => {
        if (role) return res.status(400).json({
            message: "Role already created"
        });
        const {
            role_name,
            status,
        } = req.body;

        const _role = new Role({
            role_name,
            status
        });

        _role.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went worng",
                    errors: error
                })
            }
            if (data) {
                return res.status(201).json({
                    message: "Role created succesfully",
                    user: data
                })
            }
        });

    });
}

// get all role data
exports.getallrole = async (req,res)=>{
        try{
            const roles = await Role.find({});
            return res.status(200).json({role:roles});
        }catch(err){
            return res.status(401).json({message:'some thing went worng !',error:err});
        }
}



exports.deleteRole = async (req,res)=>{
        try{
            await  Role.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Role delete successfully "});
        }catch(err){
            res.status(401).json({error:err});
        }
}


// role update successfully
exports.updateRole = async (req,res)=>{
        try{
            const updaterole = await  Role.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});
            res.status(200).json({message:"Role update successfully ",updaterole});
        }catch(err){
            res.status(401).json({error:err});
        }
}


// get single 
exports.singlerole = async (req,res)=>{
        try{
            const role = await Role.findById(req.params.id);
            res.status(200).json(role);
        }catch(err){
            res.status(401).json({error:err});
        }
}