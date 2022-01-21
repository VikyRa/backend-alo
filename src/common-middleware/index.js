const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const multer = require('multer');
const path = require('path');

const {v4 : uuidv4} = require('uuid');


exports.requireSignin = (req, res, next) => {
// console.log(req.headers);
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SCRETE);
        req.user = user;
        // jwt.decode()

    }else{
        return res.status(500).json({message:"Authorization require"});
    }
    next();
}

// CHECK USER LOGIN OR NOT
exports.userMiddleware = (req,res,next)=>{
    if(req.user.role !=='user'){
        return res.status(500).json({message:"User access denied"})
    }
    next();
}


// CHECK ADMIN LOGIN OR NOT
exports.adminMiddleware = (req,res,next)=>{

    if(req.user.role !== 'admin'){
        return res.status(500).json({message:"Admin access denied"})
    }
    next();
}


// upload file 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, shortid.generate() + '-'+file.originalname)
    }
  })
  
  exports.upload = multer({ storage })