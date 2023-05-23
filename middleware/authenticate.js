const jwt= require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{
    let token = req.headers.authorization;
    if(!token){
        res.send({status:"FAILED","msg":"please log in"})
        return
    }
    const decode= jwt.verify(token,process.env.userkey);
    if(!decode){
        res.send({status:"FAILED","msg":"please log in"})
        return
    }else{
        const userID = decode.userID;
        const userRole = decode.userRole;
        req.body.userID=userID;
        req.body.userRole = userRole;
        next() 
    }  
}

module.exports={
    authentication
}