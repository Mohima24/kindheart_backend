const mongoose = require("mongoose")

const productSchema= mongoose.Schema({
    name:String,
    rating:Number,
    price:Number,
    material:String,
    adminID:String,
    adminName:String,
    img:String,
    ptype:String
},{
    versionKey:false
})

const ProductModel= mongoose.model("products",productSchema)

module.exports={
    ProductModel
}