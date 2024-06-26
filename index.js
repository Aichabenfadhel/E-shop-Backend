import express from "express";
import dotenv from "dotenv";
// const colors=require("colors")
import morgan from "morgan"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoutes from "./routes/productRoute.js"
import cors from "cors"
//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/products',productRoutes);

//rest api
app.get("/", (req, res) => {
  //   res.send({
  //     message: "Welcome to ecommerce app",
  //   });
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON ${process.env.DEV_MODE} MODE ON PORT ${PORT}!`);
});
