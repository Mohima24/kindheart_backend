const express = require("express");
const {connection}= require("./conifg/db");
const {userRouter}=require("./routers/user.router.js");
const {productRouter} = require("./routers/product.router.js");
const {orderRouter} = require("./routers/order.router.js")
let cors= require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",userRouter);
app.use("/products",productRouter);
app.use("/orders",orderRouter);

app.get("/",(req,res)=>{

    res.send("Home page");

})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(`http://localhost:${process.env.port}`)
    }
    catch(err){
        console.log(err)
    }
})

