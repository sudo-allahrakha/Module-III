const mongoose = require("mongoose");

const userScehma = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{ type: String, default: "user"},
    phone: String, 
    address: String,
    image: String,
    status: { type: String, default: "deactive"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    otp: String,
    emailSubscription: { type: Boolean, default: false },
    
  });
  
  const Users = mongoose.model("users", userScehma);

  module.exports = Users;