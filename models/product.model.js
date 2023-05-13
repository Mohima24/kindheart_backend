const mongoose = require("mongoose")

const productSchema= mongoose.Schema({
    name:String,
    rating:Number,
    price:Number,
    material:String,
    sellerID:String,
    img:String,
    ptype:String
},{
    versionKey:false
})

const ProductModel= mongoose.model("products",productSchema)

module.exports={

    ProductModel
    
}