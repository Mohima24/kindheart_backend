const express = require('express');
const {authentication} = require("../middleware/authenticate")
const authorized = require("../middleware/authorise")
const orderController = require("../controllers/order.controller")
const orderRouter = express.Router();


orderRouter.get("/orderItems/agregate",authentication,authorized(["admin"]),orderController.getAllOrderdetails);
orderRouter.get("/orderItems/:userID",authentication,authorized(["admin","customer"]),orderController.getUserOrderdetails);
orderRouter.post("/orderItems",authentication,authorized(["customer"]),orderController.postOrder);

module.exports= {orderRouter}