
const { Usermodel } = require("../models/users.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.emaillogin = async (req, res) => {

    try{
      const { email, password } = req.body;
      if(email){

        const findeuser = await Usermodel.findOne({ email })
        
        if(findeuser.verify==false){
            res.status(403).send({"msg":"user not register"})
            return 
        }
  
        if(findeuser){
          const hashpass= findeuser.password;
  
          bcrypt.compare(password, hashpass, async(err, result) => {
            if(result){
              const access_token = jwt.sign({userID:findeuser._id,userRole:findeuser.role},process.env.userkey,{expiresIn:"7d"})
              const refresh_token = jwt.sign({userID:findeuser._id,userRole:findeuser.role},process.env.user_refresh_token,{expiresIn:"30d"})
  
              // res.cookie("normal_token",access_token,{httpOnly:true,maxAge:60*1000})
  
              // res.cookie("refresh_token",refresh_token,{httpOnly:true,maxAge:60000*7})
              res.send({"message":"login successfully",access_token,refresh_token,findeuser})
            }else{

              res.status(403).send({"msg":"error while decrypt"})
            }
          })
  
        }else{
          throw Error({"message":"Please sign up"})
        }
  
      }else{
        throw Error({"message":"Enter Valid Email"})
      }
    }catch(err){
      throw Error({"message":"log in catch error"})
    }

}

exports.phonelogin = async (req, res) => {

    try{
      const { mobile, password } = req.body;
      if(mobile){

        const findeuser = await Usermodel.findOne({ mobile })

        if(findeuser){

            if(findeuser.verify==false){
                res.status(403).send({"msg":"user not register"})
                return 
            }

          const hashpass= findeuser.password;
  
          bcrypt.compare(password, hashpass, async(err, result) => {
            if(result){
  
              const access_token = jwt.sign({userID:findeuser._id,userRole:findeuser.role},process.env.userkey,{expiresIn:"1d"})
              const refresh_token = jwt.sign({userID:findeuser._id,userRole:findeuser.role},process.env.user_refresh_token,{expiresIn:"30d"})

              res.send({"message":"login successfully",access_token,refresh_token})
  
            }else{
  
              res.status(500).send(err)

            }
          })
  
        }else{
  
          throw Error({"message":"Please sign up"})
  
        }
  
      }else{

        throw Error({"message":"Enter Valid Mobile"})

      }
    }catch(err){
      throw Error({"message":"log in catch error",err})

    }
    
}

exports.getnewToken = async (req,res)=>{

    let token = req.headers.authorization?.split(" ")[1];
  
    if(!token){
  
        res.status(400)
        res.send({"msg":"Plz login first"})
  
    }else{
  
        jwt.verify(token,process.env.user_refresh_token,async(err,decode)=>{
  
            if(err){
  
                res.status(400)
                res.send({"msg":"Plz login first","err":err.message})
  
            }else{
  
                const normal_token=jwt.sign({userID:decode.userID,userRole:decode.userRole},process.env.userkey,{expiresIn:"30s"})
                res.cookie("normal_token",normal_token,{httpOnly:true,maxAge:60*1000*1000})
                res.send({"msg":"login successfull",normal_token})
  
            }
  
        })
  
    }
  
  }