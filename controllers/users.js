const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Users = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();



//for testing using gmail 

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "your_email@gmail.com",
//     pass: "your_app_password",
//   },
// });

let getUsers = async (req, res) => {
  try {
    
    // let token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({ message: "Unauthorized i.e. no token" });
    // }
    // token = token.split(" ")[1];

    // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({ message: "Unauthorized", error: err });
    //   }
    //   const id = decoded._id;
    //   const role = decoded.role;
    //   const email = decoded.email;
    //   // if (role!= "admin") {
    //   //   return res.status(401).json({ message: "Unauthorized i.e. no permissions " });
    //   // }

    // })

    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let getUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const user = await Users.findOne({ _id: id });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const user = await Users.findByIdAndDelete({ _id: id });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let createUser = async (req, res) => {
  try {
    const user = req.body;
    const { email, password } = user;
    const checkEmail = await Users.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      user.password = hash;
      const newUser = new Users(user);
      newUser.validateSync();

      let otp=Math.floor(100000 + Math.random() * 900000)
      newUser.otp=otp;



      await newUser
        .save()
        .then(() => {

          sendEmail.sendEmailNotification(email,user.firstName,"OTP for Verification",otp)

          return res
            .status(201)
            .json({ message: "User created", data: newUser });
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let updateUser = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized i.e. no token" });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized", error: err });
      }
      const id = decoded._id;
      const role = decoded.role;
      const email = decoded.email;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const user = req.body;
      const updatedUser = await Users.findByIdAndUpdate({ _id: id }, user, {
        new: true,
      });

      if (updatedUser == null) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User updated", data: updatedUser });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};




// Todo: OTP_VERIFICATION (set user to active , and send welcome email also)
// Create a new collection for Tokens (userId, token,status)
// isAdmin

let otpVerification = async (req, res) => {

}


let loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let error = [];
    if (!email) {
      error.push("Email is required");
    }
    if (!password) {
      error.push("Password is required");
    }
    if (error.length > 0) {
      return res.status(400).json({ message: error });
    }
    // const user = await Users.findOne({email: email,password: password});
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Email " });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result) {
       
        // if (user.status == "deactive") {
        //   return res.status(401).json({ message: "User is inactive" });
        // }

        let payload = {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
        let options = {
          expiresIn: "1h",
          // expiresIn: 30,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
       

        // sendEmail.sendEmailNotification(user.email, user.firstName,"Welcome to E-commerce");


        return res.status(200).json({
          message: "Login Success",
          data: {
            token: token,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,

              phone: user.phone,
              address: user.address,
              image: user.image,
            },
          },
        });
      } else {
        return res.status(200).json({ message: "Invalid Password" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  loginUser,
};
