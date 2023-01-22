const express = require("express")
const {ProductModel} = require("../models/product.model")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const productRouter = express.Router()

productRouter.get("/all",async(req,res)=>{
        let data = await ProductModel.find({}).limit(5)
        res.send(data)
})
productRouter.get("/render",async(req,res)=>{
    let data = await ProductModel.find()
    res.send(data)
})
productRouter.get("/:id",async(req,res)=>{
    let ID = req.params.id
    let data = await ProductModel.findOne({_id:ID})
    res.send(data)
})
productRouter.get("/",async(req,res)=>{
    const {ptype,rating,sort,limit,page} = req.query;
    let queries = {};
    
    if(rating == undefined && ptype==undefined){
        queries={}
    }else if(rating==undefined ||rating==null|| rating==""){
        queries.ptype = { '$regex': ptype, '$options': 'i' };
    }else if(!ptype){
        if(rating==5){
            queries.rating={$eq:5.0}
        }else if(rating==4){
            queries["$and"]=[{rating:{$gte:4.0}}, {rating:{$lte:5.0}}]
        }else if(rating==3){
            queries["$and"]=[{rating:{$gte:3.0}}, {rating:{$lte:5.0}}]
        }else if(rating==2){
            queries["$and"]=[{rating:{$gte:2.0}}, {rating:{$lte:5.0}}]
        }else if(rating==1){
            queries["$and"]=[{rating:{$gte:1.0}}, {rating:{$lte:5.0}}]
        }
    }else{
        if(rating==5){
            queries["$and"]=[{rating:{$eq:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}]
        }else if(rating==4){
            queries["$and"]=[{rating:{$gte:4.0}},{rating:{$lte:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}]
        }else if(rating==3){
            queries["$and"]=[{rating:{$gte:3.0}},{rating:{$lte:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}]
        }else if(rating==2){
            queries["$and"]=[{rating:{$gte:2.0}},{rating:{$lte:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}]
        }else if(rating==1){
            queries["$and"]=[{rating:{$gte:1.0}},{rating:{$lte:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}]
        }
    }
    let sorting = {}
    if(sort ==1){
        sorting.price = 1;
    }else if(sort == -1){
        sorting.price = -1
    }
    let limits=0
    if(limit!=undefined){
        limits = limit
    }
    let data = await ProductModel.find(queries).sort(sorting).skip((page - 1) * limit).limit(limits);
    res.send(data)
})
productRouter.post("/post",async(req,res)=>{
    const {name,rating,price,material,adminID,adminName,img,ptype}= req.body;
    try{
        const postData = new ProductModel({name,rating,price,material,adminID,adminName,img,ptype})
        await postData.save()
        res.send(statusbar=200)
    }catch(err){
        res.send(err)
    }
})

productRouter.patch("/update/:id",async(req,res)=>{
    const id= req.params.id;
    let data = await ProductModel.findOne({_id:id})
    let reqbody= req.body
    let reqID = req.body.adminID
    if(data){
        let dataId = data.adminID
        if(reqID==dataId){
            await ProductModel.findByIdAndUpdate({_id:id},reqbody)
            res.send("Data has been successfully updated")
        }else{
            res.send("You are not authorized")
        }
    }else{
        res.send("Data is not present")
    }
})

productRouter.delete("/delete/:id",async(req,res)=>{
    const id= req.params.id;
    let data = await ProductModel.findOne({_id:id})
    let reqID = req.body.userID
    if(data){
        let dataId = data.userID
        if(reqID==dataId){
            await ProductModel.findByIdAndDelete({_id:id})
            res.send("Data has been successfully deleted")
        }else{
            res.send("You are not authorized")
        }
    }else{
        res.send("Data is not present")
    }
})


module.exports={
    productRouter
}

// {
//     "name":"Assorted Gold Pedestal Metal Candle Holders",
//   "rating":4.3,
//   "price":1,
//   "material":"Iron",
//   "img":"https://www.dollartree.com/ccstore/v1/images/?source=/file/v4279143830483445188/products/356222.jpg&height=940&width=940",
//   "ptype":"Candleholders"
//   }


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2M2YjE4MjBiY2FkMjkzYjZlZGUwY2QiLCJpYXQiOjE2NzM5NzcwMDV9.VUF-hmVSC6MBGEEL1HyztaWY-IKKsAPoqYnfvhCelGw