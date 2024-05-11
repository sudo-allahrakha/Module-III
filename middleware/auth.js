const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

let checkAuth = (req, res, next) => {
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
      req.role=decoded.role;

      
      // if (role != "admin") {
      //   return res
      //     .status(401)
      //     .json({ message: "Unauthorized i.e. no permissions " });
      // }
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};


let checkAdmin = (req, res, next) => {
  try {
   
    let role=req.role;
    if (!role || role != "admin") {
      return res
        .status(401)
        .json({ message: "Unauthorized i.e. no permissions " });
    }
    next();

  }catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};


module.exports = { checkAuth,checkAdmin };
