const { Order } = require("../models/order.model");
const { Usermodel } = require("../models/users.model")

exports.getAllOrderdetails = async(req,res)=>{
    const data = await Order.aggregate([
        {
            "$unwind": "$orderItems"
          },
          {
            "$lookup": {
              "from": "products",
              "localField": "orderItems.product",
              "foreignField": "_id",
              "as": "products"
            }
          },
          {
            "$set": {
              "products": {
                "$first": "$products"
              }
            }
          },
          {
            "$project": {
              "user": 1,
              "products": {
                "productsId": "$products",
                "quantity": "$orderItems.quantity",
                "_id": "$products._id"
              }
            }
          },
          {
            "$group": {
              "_id": "$_id",
              "user": {"$first": "$user"},
              "products": {"$push": "$products"}
            }
          },
          {
            "$lookup": {
              "from": "users",
              "localField": "user",
              "foreignField": "_id",
              "as": "user"
            }
          }
      ])
      res.send(data)
    
}

exports.getUserOrderdetails = async(req,res)=>{
    const userID = req.params.userID;
    const role = req.body.userRole;
    const loginuserID = req.body.userID;
    try{
        if(role == "customer" && userID!=loginuserID){
            res.send({msg:"you are not authorised"});
            return;
        }
        const data = await Order.aggregate([
              { 
                "$match": { 
                    "$expr" : { 
                        "$eq": [ 
                            '$user' , { 
                                "$toObjectId": `${userID}` 
                            } 
                        ]
                     } 
                    } 
              },
              {
                "$unwind": "$orderItems"
              },
              {
                "$lookup": {
                  "from": "products",
                  "localField": "orderItems.product",
                  "foreignField": "_id",
                  "as": "products"
                }
              },
              {
                "$set": {
                  "products": {
                    "$first": "$products"
                  }
                }
              },
              {
                "$project": {
                  "user": 1,
                  "products": {
                    "productsId": "$products",
                    "quantity": "$orderItems.quantity",
                    "_id": "$products._id"
                  }
                }
              },
              {
                "$group": {
                  "_id": "$_id",
                  "user": {"$first": "$user"},
                  "products": {"$push": "$products"}
                }
              },
              {
                "$lookup": {
                  "from": "users",
                  "localField": "user",
                  "foreignField": "_id",
                  "as": "user"
                }
              }
            ])
        res.send({data})
    }catch(err){
        res.status(403).send({error:"details is not available",err})
    }

}

exports.postOrder = async(req,res)=>{
    const user = req.body.userID;
    const userdetail = await Usermodel.findById({_id:user});
    const orderItems = req.body.orderItems;
    const totalBill = req.body.totalBill;

    try{
        if(userdetail.verify==true){

            const payload = await new Order({user,orderItems,totalBill});
            await payload.save();
            res.send({status:"OK","msg":"order has placed"})

        }else{

            res.send({status:"FAILED",msg:"You are not register"})

        }
    }catch(err){

        console.log(err)

    }
}
