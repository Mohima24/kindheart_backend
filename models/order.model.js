const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderItems: [
          {
            product:{ 
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
            },
            quantity: {type :Number, required:true}
          }  
    ],
  },
  { 
    versionKey:false,
    timestamps: true,
  }
);

const Order = mongoose.model("Cart", orderSchema);

module.exports={
    Order
}