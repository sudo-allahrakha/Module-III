const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  loginUser,
  }=require("../controllers/users");

  const {checkAuth,checkAdmin}=require("../middleware/auth");

const router=express.Router();

router.get("/",checkAuth,getUsers);



// router.get("/",checkAuth,checkAdmin,getUsers);

router.get("/:id/", getUser);
router.delete("/:id/",checkAuth, deleteUser);  
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/",updateUser);

module.exports=router;