
const { Usermodel } = require("../models/users.model")
const { UserOTPVerification } = require("../models/otp.model")
const bcrypt = require("bcrypt")
const nodemailer= require("nodemailer");
require("dotenv").config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const auth_token = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, auth_token)

const transporter = nodemailer.createTransport({

    port: 465,
    service:'gmail',
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

exports.signupuserMobile =  async (req, res) => {
    const { firstName, lastName, password, mobile , role} = req.body;
    if (password == "") {
        return res.json({ status: "FAILED", "messege": "Empty Password" })
    }

    if(mobile){
        if(!/^[1-9]\d*(\.\d+)?$/.test(mobile)){
            return res.json({ status: "FAILED", "messege": "Invadil email" ,"say":"hello"})
        }else{
            const finduser = await Usermodel.find({mobile})
            if(finduser.length>0){
                res.status(501).send("already logged in")
                return 
            }
            bcrypt.hash(password, 7 ,(err, hash)=> {
                if(err){
                    res.send("bcrypt err")
                }else{
                    const user = new Usermodel({
                      firstName, lastName, mobile, password:hash ,role
                    })
                    user.save()
                    .then((result)=>{
                        sendOTPVErificationNumber(result,res)
                    })
                }
            })
        }
    }
}

exports.signupemail = async (req, res) => {
    const { firstName, lastName, password, email ,role } = req.body;

    if (password == "") {
        return res.json({ status: "FAILED", "messege": "Empty Password" })
    }
    if ( email ) {
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            return res.json({ status: "FAILED", "messege": "Invadil email" ,"say":"hello"})
        }else{
            const finduser = await Usermodel.find({email})
            if(finduser.length>0){
                res.status(501).send("already logged in")
                return 
            }
            bcrypt.hash(password, 7 ,(err, hash)=> {
                if(err){
                    res.send("bcrypt err")
                }else{
                    const user = new Usermodel({
                      firstName, lastName, email, password:hash ,role
                    })
                    user.save()
                    .then((result)=>{
                        sendOTPVErificationEmail(result,res)
                    })
                }
            })
        }
    }
}

async function  sendOTPVErificationEmail({_id,email},res){
    try{
        const otp = `${Math.floor(1000+Math.random()*9000)}`
        const mailoptions={
            to:email,
            from:`${process.env.email}`,
            subject:"Verify Your Email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign-up</p>
            <p>This code <b>expires in 1 hour</b></p>`
        }
        bcrypt.hash(otp, 7 , async (err, hash) => {
          const newOTPVerification = await new UserOTPVerification({
              userID:_id,
              otp:hash,
              createdAt:Date.now(),
              expiresAt:Date.now() + 3600000
          })
          await newOTPVerification.save()
          await transporter.sendMail(mailoptions)
          res.json({
              status:"PENDING",
              message:"Verification otp email sent",
              data:{
                  userID:_id,
                  email
              }
          })
      });
  
    }catch(err){
        res.status(400).json({
            status:"FAILED",
            message:err.message
        })
        console.log("while sending mail")
        console.log(err)
    }
  }

  
async function sendOTPVErificationNumber({ _id, mobile }, res) {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    client.messages.create({
      to: `+91${mobile}`,
      from: '+12765661405',
      body: `${otp} is the verfication code to log in to your Flipkart account. Please DI NOT SHARE this code with anyone including delivery agents. @www.flipkart.com #${otp}.This code <b>expires in 1 hour`
    })
    bcrypt.hash(otp, 7 , async (err, hash) => {
        const newOTPVerification = new UserOTPVerification({
                userID: _id,
                otp: hash,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000
          })
          await newOTPVerification.save()
          res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
              userID: _id,
              mobile
            }
          })
    });
  } catch (err) {
    res.json({
      status: "FAILED",
      message: err.message
    })
    console.log("while sending mail")
    console.log(err)
  }
}

exports.resendOtpmobile =  async(req,res)=>{
    try{
      let {mobile}=req.body
      if(!mobile){
        throw Error("Empty user details")
      }else{
        const finduser = await Usermodel.find({ mobile})
        const userID = finduser[0]._id
        if(finduser.length>0){
          await UserOTPVerification.deleteMany({userID})
          sendOTPVErificationNumber({ _id:userID, mobile }, res)
        }else{
          throw Error("please give correct details")
        }
      }
    }
    catch(err){
      throw Error(err)
    }
}


exports.resendOTPemail = async(req,res)=>{

    try{
      let {userID,email}=req.body
      if(!userID || !email){
        throw Error("Empty user details")
      }else{
        const finduser = await Usermodel.find({ email , _id:userID})
        if(finduser>0){
          await UserOTPVerification.deleteMany({userID})
          sendOTPVErificationEmail({_id:userID,email},res)
        }else{
          throw Error("please give correct details")
        }
  
      }
    }
    catch(err){
      console.log(err)
      throw Error("sending resend otp mail")
    }
  }