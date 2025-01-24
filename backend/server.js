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
import serviceRequestRoutes from "./routes/serviceRequestRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import riderRouter from "./routes/riderRoute.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import referralRouter from "./routes/referralCodeRoute.js";
import ticketRoutes from "./routes/ticketRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { protect, authorize } from "./middleware/adminAuthMiddleware.js";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/riders", protect, authorize(['super-admin', 'sub-admin']), ridersRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/serviceRequests", serviceRequestRoutes);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// app.use("/api", adminAuth, emailRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userRouter);
app.use("/api/rider", riderRouter);
app.use("/api/seller", sellerRoutes);

app.use("/api/referralCode", protect, authorize(['super-admin']), referralRouter);
app.use("/api/tickets", ticketRoutes);


app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
	res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
