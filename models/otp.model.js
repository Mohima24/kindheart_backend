const mongoose = require("mongoose")

const otpSchema= mongoose.Schema({
    userID:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
},{
    versionKey:false
})
const UserOTPVerification = mongoose.model("UserOTPVerification",otpSchema)

module.exports = {
    UserOTPVerification
}