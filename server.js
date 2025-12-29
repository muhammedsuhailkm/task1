const express = require("express");
const mongoose = require("mongoose");
const blog = require("./src/routes/blog");
const dotenv = require("dotenv");
const Blog = require("./src/models/article");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/blog", blog);

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "blog",
  })
  .then(() => console.log("✓ MongoDB Atlas  Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
