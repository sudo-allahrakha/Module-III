const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function dbConnect() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  module.exports = dbConnect;