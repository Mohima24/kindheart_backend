const express = require("express")
require("dotenv").config()
const productController = require("../controllers/product.controller")
const productRouter = express.Router()
const authorized = require("../middleware/authorise")
const {authentication} = require("../middleware/authenticate")

productRouter.get("/all",productController.getallProducts)
productRouter.get("/limited",productController.limitedData)
productRouter.get("/:id",productController.findbyIDProducts)
productRouter.get("/",productController.queryData)
productRouter.post("/upload",authentication,authorized(["admin","seller"]),productController.postData)
productRouter.patch("/update/:id",authentication,authorized(["admin","seller"]),productController.updateData)
productRouter.delete("/delete/:id",authentication,authorized(["admin","seller"]),productController.deleteData)


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