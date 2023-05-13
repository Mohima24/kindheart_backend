const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    mobile: Number,
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    password: String,
    verify: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

const Usermodel = mongoose.model("user", userSchema);

module.exports = {
  Usermodel
};