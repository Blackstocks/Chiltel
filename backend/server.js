import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import ridersRouter from "./routes/ridersRoute.js";
import serviceRoutes from "./routes/serviceRoute.js";
import adminAuth from "./middleware/adminAuth.js";
import serviceRequestRoutes from "./routes/serviceRequestRoute.js";
import emailRoutes from "./routes/emailRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import riderRouter from "./routes/riderRoute.js";
import sellerRoutes from './routes/sellerRoutes.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/riders", adminAuth, ridersRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/serviceRequests", serviceRequestRoutes);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// app.use("/api", adminAuth, emailRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userRouter);
app.use("/api/rider", riderRouter);
app.use('/api/seller', sellerRoutes);

app.get("/", (req, res) => {
	res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
