const {ProductModel} = require("../models/product.model")
require("dotenv").config()

exports.getallProducts = async(req,res)=>{
    let data = await ProductModel.find()
    res.send(data)
}
exports.limitedData = async(req,res)=>{
    let data = await ProductModel.find({}).limit(5)
    res.send(data)
}
exports.findbyIDProducts = async(req,res)=>{
    let ID = req.params.id
    let data = await ProductModel.findOne({_id:ID})
    res.send("hello")
}

exports.queryData = async(req,res)=>{

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

            queries["$and"]=[{rating:{$eq:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}];

        }else if(rating==4){
            queries["$and"]=[{rating:{$gte:4.0}},{rating:{$lte:5.0}},{ptype:{ '$regex': ptype, '$options': 'i' }}];
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

        sorting.price = -1;

    }
    let limits=0;

    if(limit!=undefined){

        limits = limit;

    }

    let data = await ProductModel.find(queries).sort(sorting).skip((page - 1) * limit).limit(limits);
    res.send(data)
}

exports.postData = async(req,res)=>{
    const {name,rating,price,material,userID,img,ptype}= req.body;
    try{
        const postData = await new ProductModel({name,rating,price,material,sellerID:userID,img,ptype})
        await postData.save()
        res.send({"msg":"Data has upload"})
    }catch(err){
        res.send(err)
    }
}

exports.updateData = async(req,res)=>{
    const id= req.params.id;
    let data = await ProductModel.findOne({_id:id})
    let reqbody= req.body;
    let reqID = req.body.userID;
    let role = req.body.userRole;

    try{
        if(data){

            if(reqID==data.sellerID || role=="admin"){
                await ProductModel.findByIdAndUpdate({_id:id},reqbody)
                res.send("Data has been successfully updated")
            }else{
                res.send("You are not authorized")
            }
    
        }else{
            res.send("Data is not present")
        }
    }catch(err){
        res.send(err)
    }
}

exports.deleteData = async(req,res)=>{

    const id= req.params.id;
    let data = await ProductModel.findOne({_id:id})
    let reqID = req.body.userID;
    let role = req.body.userRole;

    if(data){

        if(reqID==data.sellerID || role=="admin"){

            await ProductModel.findByIdAndDelete({_id:id})
            res.send("Data has been successfully deleted")

        }else{
            res.send("You are not authorized")
        }

    }else{
        res.send("Data is not present")
    }
}