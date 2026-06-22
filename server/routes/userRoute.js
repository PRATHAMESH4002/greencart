import express from "express";
import {
  register,
  login,
  verifyOtp,
  isAuth,
  logout
} from "../controllers/userController.js";

import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

/* -------------------- AUTH ROUTES -------------------- */

// Register new user
userRouter.post("/register", register);

// Login Step 1 → Password check + Send OTP
userRouter.post("/login", login);

// Login Step 2 → Verify OTP + Issue JWT
userRouter.post("/verify-otp", verifyOtp);

// Check authenticated user
userRouter.post("/is-auth", authUser, isAuth);

// Logout user
userRouter.get("/logout", logout);

export default userRouter;
