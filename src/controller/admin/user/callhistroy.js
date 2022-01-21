const Callhistory = require('../../../models/user/call_history');

exports.getcallhistory = async (req,res)=>{
    try{
        const id = req.params.id;
        const result = await Callhistory.find({userId:id}).populate("astronomerId");
        // if(err) return  res.status(400).json(err);
        return  res.status(200).json(result);
        // console.log(result);
       
    }catch(error){
        return res.status(400).json({error:error});
    }
} 


