const mongoose = require("mongoose")

const orderSchema= mongoose.Schema({
    name:String,
    quantity:String,
    amount:Number,
    userName:String
},{
    versionKey:false
})

const Ordermodel= mongoose.model("order",orderSchema)

module.exports={
    Ordermodel
}