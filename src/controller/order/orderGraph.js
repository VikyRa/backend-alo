const Order = require('../../models/admin/order/orderModel');
const Product = require('../../models/admin/product/product');


require("dotenv").config();
const sendToken = require("../../utiles/jwtToken");
const sendEmail = require("../../utiles/sendEmail");
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");
var validator = require("email-validator");
const uniquId = require("uniqid");
const path = require("path");
const Formidable = require("formidable");
const crypto = require("crypto");
const request = require("request");
const Razorpay = require("razorpay");


// get graph api
exports.getgrapdata = catchAsyncErrors(async (req, res, next) => {
    const graphdata = {
        daily: [{
            id: 0,
            amount: 0,
            totalorder: 0
        },
        {
            id: 1,
            amount: 0,
            totalorder: 0
        },
        {
            id: 2,
            amount: 0,
            totalorder: 0
        },
        {
            id: 3,
            amount: 0,
            totalorder: 0
        }, {
            id: 4,
            amount: 0,
            totalorder: 0
        },
        {
            id: 5,
            amount: 0,
            totalorder: 0
        },
        {
            id: 6,
            amount: 0,
            totalorder: 0
        },
        ],
        monthly: [
            {
                id: 0,
                amount: 0,
                totalorder: 0
            },
            {
                id: 1,
                amount: 0,
                totalorder: 0
            },
            {
                id: 2,
                amount: 0,
                totalorder: 0
            },
            {
                id: 3,
                amount: 0,
                totalorder: 0
            }, {
                id: 4,
                amount: 0,
                totalorder: 0
            },
            {
                id: 5,
                amount: 0,
                totalorder: 0
            },
            {
                id: 6,
                amount: 0,
                totalorder: 0
            },
            {
                id: 7,
                amount: 0,
                totalorder: 0
            },
            {
                id: 8,
                amount: 0,
                totalorder: 0
            },
            {
                id: 9,
                amount: 0,
                totalorder: 0
            },
            {
                id: 10,
                amount: 0,
                totalorder: 0
            },
            {
                id: 11,
                amount: 0,
                totalorder: 0
            }
        ]
    }
    try {
        await Order.find(
            async function (err, found) {
                if (found) {

                    await found.map((item) => {
                        if ((Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate())) < 7) && (parseInt(item.createdAt.getMonth()) === parseInt(new Date().getMonth())) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                            graphdata.daily[Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate()))].amount += parseInt(item.totalPrice)
                            graphdata.daily[Math.abs(parseInt(item.createdAt.getDate()) - parseInt(new Date().getDate()))].totalorder += 1
                        }

                        if ((Math.abs(parseInt(item.createdAt.getMonth()) - parseInt(new Date().getMonth())) < 12) && (parseInt(item.createdAt.getFullYear()) === parseInt(new Date().getFullYear()))) {
                            graphdata.monthly[Math.abs(parseInt(item.createdAt.getMonth()) - parseInt(new Date().getMonth()))].amount += parseInt(item.totalPrice)
                            graphdata.monthly[Math.abs(parseInt(item.createdAt.getMonth()) - parseInt(new Date().getMonth()))].totalorder += 1
                        }
                    })
                }
            }
        )
        res.status(200).json({
            success: true,
            graphdata
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: error
        });
    }
})
