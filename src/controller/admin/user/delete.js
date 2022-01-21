const User = require('../../../models/user/user');


exports.deleteuser = async (req,res)=>{
    try{
        if(req.params.id =='' || req.params.id == null){
            res.status(400).json({message:"Some thing went wong"});
        }else{
            await  User.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"User delete successfully "});
        }
       
    }catch(err){
        res.status(401).json({error:err});
    }
}