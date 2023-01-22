const express = require("express")
const {AdminModel} = require("../models/admin.model")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const adminRouter = express.Router()

adminRouter.get("/",(req,res)=>{
    res.send("admin")
})

adminRouter.post("/create",async(req,res)=>{
    const {name,email,pass,phone,empid} = req.body;
    try{
       let data = await AdminModel.find({$or:[{email},{phone},{empid}]})
       if(data.length==0){
            bcrypt.hash(pass, 7, async (err, secure_password) => {
                if(err){
                    res.send({"msg":"while brcrypt the msg"})
                }else{
                    const createData= await AdminModel({name,email,pass:secure_password,phone,empid})
                    createData.save()
                    res.send("admin has been register")
                }
            })
       }else{
        res.send({"msg":"admin already registered"})
       }
    }catch(err){
        console.log(err)
        res.send({"msg":"admin while register"})
    }
})


adminRouter.post("/login",async(req,res)=>{
    const {email,pass,phone,empid} = req.body;
    try{
        let data = await AdminModel.findOne({$or:[{email},{phone},{empid}]})
        if(data){
            bcrypt.compare(pass, data.pass, async(err, result) => {
                if(result){
                    const token = jwt.sign({"adminID": data._id,"adminName":data.name}, process.env.adminkey,{expiresIn:"2h"})
                    res.send({"msg":"Admin logIn Successfully","token":token})
                }else{
                    res.send(statusbar=400)
                }
            })
        }else{
            res.send(statusbar=400)
        }
    }
    catch(err){
        console.log(err)
        console.log("something went wrong while log in")
    }
})

module.exports={
    adminRouter
}



// {
//     "name":"mohima",
//     "email":"mohima@gmail.com",
//     "pass":"mohima",
//     "phone":"6291953764"
// }