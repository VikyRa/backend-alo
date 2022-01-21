
const Chat = require('../../models/chat/ChatSchema');
const User = require('../../models/user/user');
const mongoose = require('mongoose');
const ErrorHander = require("../../utiles/errorhander");
const catchAsyncErrors = require("../../common-middleware/catchAsyncErrors");


// Create new chat between users
// exports.savechat = async (req, res, next) => {
//     if (!req.body.user) {
//         console.log('User id not sent with request');
//         return res.sendStatus(400)
//     }
 
//     let userTo = mongoose.Types.ObjectId(req.body.user._id)
//     let userFrom = mongoose.Types.ObjectId(req.user._id)
    
//     Chat.findOneAndUpdate(
//         {
//             users: {
//                 $all: [
//                     { $elemMatch: { $eq: userTo } },
//                     { $elemMatch: { $eq: userFrom } },
//                 ],
//             },
//         },
//         {
//             users: [req.body.user._id, req.user._id]
//         },
//         {
//             upsert: true, returnNewDocument: true, setDefaultsOnInsert: true
//         },
//     )
//         .populate('users')
//         .then(results => res.status(200).send(results))
//         .catch(err => {
//             console.log(err)
//             res.sendStatus(400)
//         })

// };

exports.getastrologersumchat = async (req,res,next)=>{
    const userTo = req.params.id;
    await Chat.aggregate([
        {
            $match:{ astrologerId: userTo }
        },
        {
            $group: {
                _id: null,
                total_time: {$sum: {$size: '$total_time'}}
            }
        }
    ]).then(results => res.status(200).send(results))
            .catch(err => {
                console.log(err)
                res.sendStatus(400)
            })
}




// [
//     {
//         $match:{ userId: userTo }
//     },
//     {
//         $group: {
//             _id: null,
//             total_time: {$sum: {$size: '$total_time'}}
//         }
//     }
// ]

exports.getusersumchat = async (req,res,next)=>{
    const userTo = req.params.id;
    await Chat.aggregate(
        [{
            $match: {
               
                userId: userTo
            }
        }, {
            $group: {
                _id: null,
                total_time: {
                    $sum: "$total_time"
                }
            }
        }]
    ).then(results => res.status(200).send(results))
            .catch(err => {
                console.log(err)
                res.sendStatus(400)
            })


            try {
                const data = await Chat.aggregate([
                  { $match: { userId: userId } },
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
                res.status(500).json(err);
              }
}
// exports.getusersumchat = async (req,res,next)=>{
//     const userTo = req.params.id;
//     await Chat.aggregate([
//         {
//             $match:{ userId: userTo }
//         },
//         {
//             $group: {
//                 _id: null,
//                 total_time: {$sum: {$size: '$total_time'}}
//             }
//         }
//     ]).then(results => res.status(200).send(results))
//             .catch(err => {
//                 console.log(err)
//                 res.sendStatus(400)
//             })
// }

exports.savechat = async (req, res, next) => {
    
    if (!req.body.user) {
        console.log('User id not sent with request');
        return res.sendStatus(400)
    }
 
    let userTo = mongoose.Types.ObjectId(req.body.user._id)
    let userFrom = mongoose.Types.ObjectId(req.user._id)
    
  const savechat =  new Chat(
        {
            users: [req.body.user._id, req.user._id],
            astrologerId:userTo,
            userId:userFrom
        }
    )
        // .populate('users')
        savechat.save().then(results => res.status(200).send(results))
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })

};


// Get a list of chats

exports.getchatlist = async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

};





exports.getchatlistis_pendding = async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } },is_accept:'0',is_complete:'0' })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

};


// chat list with is_accept
exports.getchatlistis_accept = async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } },is_accept:'1',is_complete:'0' })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

};

exports.getchatlistis_complete = async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } },is_accept:'1',is_complete:'1' })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

};


// accept chat staert
exports.updateaccept = async (req,res) =>{
    const id = req.params.id;
    const data = await Chat.findByIdAndUpdate(id, {
        $set: { is_accept: req.body.is_accept }
      }, { new: true }).then(results => {
        res.status(200).send({message:'Chat active successfully'})
    })
    .catch(error => {
        
        res.status(400).send({error:'Someting went wrong'})
    })
}

// get chat by id
exports.getchatlistbyid = async (req, res, next) => {
    // console.log(req.params.chatId);
    Chat.findOne({ _id:req.params.chatId, users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users")
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

};

// get chat by id
exports.bychatId = async (req, res, next) => {
    // console.log(req.params.chatId);
    Chat.findOne({ _id:req.params.id})
        .populate("users")
        .then(results => res.status(200).send(results))
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

};

exports.findChattody = async (req, res, next)=>{
    // await Chat.find([
    //     {  
    //         users: {
    //             $all: [
    //                 { $elemMatch: { $eq: '61aa19e7966c994304f75b9b' } },
    //                 { $elemMatch: { $eq: '61aa19e7966c994304f75b9b' } },
    //             ],
    //         }
    //       },
    //     { $group: { _id: null, TotalTime: { $sum: "$total_time" } } }
    // ]).then((res)=>{
    //     res.status(200).send(results)
    // }).catch((err)=>{
    //     res.status(401).send(err)
    // })

       
    await Chat.aggregate([{
        $group: {
            "_id": "$total_time",
            "total": {
                $sum: 1
            }
        }
    }, {
        $project: {
            "total_time": 0,
        }
    }]).then((results)=>{
        res.status(200).send(results)
    }).catch((err)=>{
        console.log(err);
        res.status(401).send(err)
    })
}



exports.getchatlistbyId = async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.body.id } } })
        .populate('users')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async results => {
            results = await User.populate(results, { path: 'latestMessage.sender' })
            res.status(200).send(results)
        })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })

};


// end chat by id
// accept chat staert
exports.endchatsession = async (req,res) =>{
    const id = req.body.id;
    const data = await Chat.findByIdAndUpdate(id, {
        $set: { is_complete: '1' }
      }, { new: true }).then(results => {
        res.status(200).send({message:'Chat session end successfully'})
    })
    .catch(error => {
        res.status(400).send({error:'Someting went wrong'})
    })
}



exports.updateChatStatus = async (req, res) => {
   const { status,chatId} = req.body;
    try {
      const data = await Chat.findByIdAndUpdate(chatId,{is_accept:status}, { new: true });

      res.status(200).json({
        message: 'Status update Successfully',
        user: data
      });
    } catch (err) {
      return res.status(401).json({ message: err });
    }
  
  }