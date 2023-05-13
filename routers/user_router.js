const express = require("express");
const userRouter = express.Router();
const userSignup = require("../controllers/usersignup.controller")
const userLogin = require("../controllers/userlogin.controller")
const userVerify = require("../controllers/userverify.controller");


userRouter.post("/signup/phone",userSignup.signupuserMobile);
userRouter.post("/signup/email",userSignup.signupemail );
userRouter.post("/login/email", userLogin.emaillogin);
userRouter.post("/login/mobile",userLogin.phonelogin);
userRouter.post("/verifyotp",userVerify.userOtpverify );
userRouter.post("/resendOTPEmail",userSignup.resendOTPemail);
userRouter.post("/resendOTPMobile",userSignup.resendOtpmobile);
userRouter.get("/getnewToken",userLogin.getnewToken);

module.exports = {userRouter}
