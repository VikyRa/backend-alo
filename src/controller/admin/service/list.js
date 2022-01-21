const Service = require('../../../models/admin/service');
const fs = require('fs');
const path = require('path');

exports.createService = async (req, res) => {
    try {

        Service.findOne({ service_name: req.body.service_name }).exec((errors, service) => {
            if (service) return res.status(400).json({
                message: "Service already registered"
            });

            const serviceObj = {
                service_name: req.body.service_name,
                short_description: req.body.short_description,
                long_description: req.body.long_description,
                status: req.body.status,
                createdBy: req.user._id,
                is_paid:req.body.is_paid

            };
            if(req.body.service_name ==='' || req.body.service_name === undefined || req.body.service_name === null){
                return res.status(400).json({
                    message: "Service Name is required"
                });
            }

            if(req.body.short_description ==='' || req.body.short_description === undefined || req.body.short_description === null){
                return res.status(400).json({
                    message: "Short Description Name is required"
                });
            }

            if(req.body.long_description =='' || req.body.long_description === undefined || req.body.long_description === null){
                return res.status(400).json({
                    message: "Long Description is required"
                });
            }

            if(req.body.status =='' || req.body.status === undefined || req.body.status === null){
                return res.status(400).json({
                    message: "Status  is required"
                });
            }
            if (req.file) {
                serviceObj.service_image = "/public/" + req.file.filename;
               
            }
            const _service = new Service(serviceObj);
            _service.save((error, services) => {
                if (error) return res.status(400).json({ error });
                if (services) {
                    res.status(201).json({ services });
                }
            });

        });

    } catch (err) {
        res.status(400).json({ err });
    }
}

// get all service
exports.getservice = async (req, res) => {
    try {
        const service = await Service.find();
        return res.status(200).json({ service });
    } catch (err) {
        res.status(400).json({ err });
    }
}


exports.getServiceDetailsById = (req, res) => {
    try {
        const  serviceId  = req.params.id;
        if (serviceId) {
            Service.findOne({ _id: serviceId }).exec((error, service) => {
                if (error) return res.status(400).json({ error });
                if (service) {
                    res.status(200).json({ service });
                }
            });
        } else {
            return res.status(400).json({ error: "Params required" });
        }

    } catch (err) {
        res.status(400).json({ err });
    }
};


// new update
exports.deleteserviceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        if (serviceId) {
            await  Service.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message:"Service delete successfully" });
        } else {
            return res.status(400).json({ error: "Params required" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};



// service update function start

exports.updateservice = async (req, res) => {
    try {
           const serviceObj ={};
        if(req.body.service_name){

            serviceObj.service_name=req.body.service_name
        }
        if(req.body.short_description){
            serviceObj.short_description=req.body.short_description
        }
        if(req.body.long_description){
            serviceObj.long_description=req.body.long_description
        }
        if(req.body.status){
            serviceObj.status=req.body.status
        }
        if(req.body.is_paid){
            serviceObj.is_paid=req.body.is_paid
        }
        
        serviceObj.createdBy=req.user._id
        const _id = req.params.id;
        if (req.file) {
            // Service.findOne({_id }).exec((errors, sfile) => { 
            //     const getfilename = sfile.service_image.split("/");
            //     fs.unlinkSync('../../../uploads/'+getfilename[2]);
            // });
            serviceObj.service_image = "/public/" + req.file.filename;
            
        }
        
        const updatedservices = await Service.findOneAndUpdate({ _id }, { $set:serviceObj }, {
            new: true,
          });
          return res.status(200).json({ updatedservices });
    } catch (err) {
        res.status(400).json({ err });
    }
}



exports.getServiceDetailsByservice = (req, res) => {
    try {
        const  service  = req.params.service;
        if (service) {
            Service.find({ is_paid: service }).exec((error, service) => {
                if (error) return res.status(400).json({ error });
                if (service) {
                    res.status(200).json({ service });
                }
            });
        } else {
            return res.status(400).json({ error: "Params required" });
        }

    } catch (err) {
        res.status(400).json({ err });
    }
};