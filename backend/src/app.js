/*create a express app*/
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = 4000;
const userRoutes = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
/*create a route*/
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://dbkishalay:helloworld123@cluster0.hxyw1.mongodb.net/oauth?retryWrites=true&w=majority"
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoute);
/*start the server*/
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
