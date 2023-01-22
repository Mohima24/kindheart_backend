const mongoose = require("mongoose")

const adminSchema= mongoose.Schema({
    name:String,
    email:String,
    empid:String,
    phone:Number,
    pass:String
},{
    versionKey:false
})

const AdminModel= mongoose.model("admin",adminSchema)

module.exports={
    AdminModel
}