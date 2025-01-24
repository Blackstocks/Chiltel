import express from "express";
import {
	loginUser,
	registerUser,
	verifyToken,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/verify', verifyToken);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
