const Callhistory = require('../../models/user/call_history');

exports.storeCallhistory = async (req,res)=>{
    try{
        const {
            userId,
            astronomerId,
            date,
            start_time,
            end_time,
            total_time
        } = req.body;
        const result = await Callhistory({
            userId,
            astronomerId,
            date,
            start_time,
            end_time,
            total_time
        });
        result.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: "Something went worng",
                    errors: error.message
                })
            }
            if (data) {
                return res.status(201).json({message:"call start",data})
            }
        });
        // console.log(result);
       
    }catch(error){
        return res.status(400).json({error:error});
    }
} 


exports.updatecallhistory = async (req, res) => {
    try {

        const callhistory = await  Callhistory.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        return res.status(200).json({message:"Call end",callhistory});

    } catch (err) {
        return res.status(401).json({message:err});
    }
};