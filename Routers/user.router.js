const express = require("express")
const {Usermodel} = require("../models/users.model")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const userRouter = express.Router()

userRouter.get("/",(req,res)=>{
    res.send("users")
})

userRouter.post("/register",async(req,res)=>{
    const {name,email,pass,phone} = req.body;
    try{
       let data = await Usermodel.find({ $or: [ {email}, {phone}]})
       if(data.length==0){
            bcrypt.hash(pass, 7, async (err, secure_password) => {
                if(err){
                    res.send({"msg":"while brcrypt the msg"})
                }else{
                    const createData= await Usermodel({name,email,pass:secure_password,phone})
                    createData.save()
                    res.send("user has been register")
                }
            })
       }else{
        res.send(statusbar=503)
       }
    }catch(err){
        console.log(err)
        res.send({"msg":"while register"})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,pass,phone} = req.body;
    try{
        let data = await Usermodel.findOne({ $or: [ {email}, {phone}]})
        if(data){
            bcrypt.compare(pass, data.pass, async(err, result) => {
                if(result){
                    const token = jwt.sign({"userID": data._id}, process.env.userkey)
                    res.send({"msg":"logIn Successfully","token":token,"userName":data.name})
                }else{
                    res.send({"msg":"Please log-in first"},statusbar=404)
                }
            })
        }else{
            res.send({"msg":"Please log-in first"},statusbar=404)
        }
    }
    catch(err){
        console.log(err)
        console.log("something went wrong while log in")
    }
})

module.exports={
    userRouter
}



// {
//     "name":"mohima",
//     "email":"mohima@gmail.com",
//     "pass":"mohima",
//     "phone":"6291953764"
// }