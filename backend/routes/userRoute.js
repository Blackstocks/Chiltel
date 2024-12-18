import express from 'express';
import { loginUser,registerUser,adminLogin, verifyToken } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/verify', verifyToken);
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

export default userRouter;