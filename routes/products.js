const express = require("express");
const {
    getProducts,
    getProduct,
    deleteProduct,
    createProduct,
    updateProduct,
  }=require("../controllers/products");
  const {checkAuth,checkAdmin}=require("../middleware/auth");

const router=express.Router();
router.get("/",getProducts);
router.get("/:id/", getProduct);
router.delete("/:id/", checkAuth, deleteProduct);  
router.post("/", createProduct);
router.put("/:id/",updateProduct);

module.exports=router;