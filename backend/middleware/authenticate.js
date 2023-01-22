const jwt= require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{
    let token = req.headers.authorization;
    if(req.method == "POST" || req.method == "PATCH" || req.method == "PUT" || req.method == "DELETE"){
        if(token){
            const decode= jwt.verify(token,process.env.adminkey)
            if(decode){
                const adminID = decode.adminID;
                req.body.adminID=adminID;
                req.body.adminName = decode.adminName
                next()
            }else{
                res.send("You are not authorized")
            }
        }else{
            res.send("You are not authorized")
        }
    }else{
        next()
    }

    
}

module.exports={
    authentication
}