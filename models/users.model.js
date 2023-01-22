const mongoose = require("mongoose")

const userSchema= mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    phone:Number
},{
    versionKey:false
})

const Usermodel= mongoose.model("user",userSchema)

module.exports={
    Usermodel
}