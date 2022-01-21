const jwt = require('jsonwebtoken');

function verify(req, res, next) {
    const authHeader =  req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SCRETE,(err,user)=>{
        if (err) res.status(403).json({message:"Token is not valid!"});
        req.user = user;
        next();
        });
    }else{
        return res.status(500).json({message:"You are not authenticated!"})
    }
}

module.exports = verify;