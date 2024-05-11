const mongoose = require("mongoose");
const Proudcts = require("../models/products");

let getProducts = async (req, res) => {
  try {
    const products = await Proudcts.find({});
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const product = await Proudcts.findOne({ _id: id });
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const product = await Proudcts.findByIdAndDelete({ _id: id });
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let createProduct = async (req, res) => {
  try {
    // Data validation
    // const {title,price,description}=req.body
    // let errors=[]
    // if (!title) {
    //   errors.push({ error: "Title is required", resource:"title" });
    // }
    // if (!price) {
    //   errors.push({ error: "Price is required" });
    // }
    // if (!description) {
    //   errors.push({ error: "Description is required" });
    // }
    // if (errors.length>0) {
    //   return res.status(400).json({message:errors})
    // }

    // const product={
    //   title:title,
    //   price:price,
    //   description:description,

    // }

    const product = req.body;

    const newProduct = new Proudcts(product);
    newProduct.validateSync();
    await newProduct
      .save()
      .then(() => {
        return res
          .status(201)
          .json({ message: "Product created", data: newProduct });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

let updateProduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const product = req.body;
    const updatedProduct = await Proudcts.findByIdAndUpdate(
      { _id: id },
      product,
      { new: true }
    );

    if (updatedProduct == null) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated", data: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};




module.exports = {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
