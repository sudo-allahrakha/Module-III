const dbConnect = require("./config/db");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

dbConnect();

// app.use("/api/v1/products", productRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

dotenv.config();
let port = process.env.PORT || 8000;
let host = process.env.HOST || "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
