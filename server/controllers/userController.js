import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/* --------------------------------------------------
   EMAIL TRANSPORTER (OTP)
-------------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* --------------------------------------------------
   REGISTER USER  →  POST /api/user/register
-------------------------------------------------- */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.json({
      success: true,
      message: "Registration successful. Please login.",
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------
   LOGIN STEP 1 → PASSWORD CHECK + SEND OTP
   POST /api/user/login
-------------------------------------------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password." });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 📧 Send OTP email
    await transporter.sendMail({
      from: "GreenCart <no-reply@greencart.com>",
      to: user.email,
      subject: "GreenCart Login OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------
   LOGIN STEP 2 → VERIFY OTP + ISSUE JWT
   POST /api/user/verify-otp
-------------------------------------------------- */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 🔑 Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------
   CHECK AUTH  →  POST /api/user/is-auth
-------------------------------------------------- */
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID missing" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------
   LOGOUT USER  →  POST /api/user/logout
-------------------------------------------------- */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
