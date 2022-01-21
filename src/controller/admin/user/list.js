const User = require('../../../models/user/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getuser = async (req,res)=>{
        try{
            const result = await User.find({role:'user'});
           
            return res.status(200).json({user:result});
        }catch(error){
            return res.status(400).json({error:error});
        }
}

exports.singleuser = async (req,res)=>{
    try{
        const result = await User.findById(req.params.id);
        // console.log(result);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json({error:error});
    }
} 



exports.userstats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear },role:'user' } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err);
  }

}

exports.astrologerstats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear },role:'astrologer' } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err);
  }

}

