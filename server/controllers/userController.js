import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ CORRECT COOKIE CONFIG (LOCALHOST SAFE)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,        // ❗ MUST be false for localhost
      sameSite: "lax",      // ❗ REQUIRED for cross-origin localhost
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
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


/* --------------------------------------------------
   LOGIN USER  →  POST /api/user/login
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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ CORRECT COOKIE CONFIG
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,     // ❗ localhost
      sameSite: "lax",   // ❗ cross-origin fix
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
    console.log(error.message);
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
    console.log(error.message);
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
      secure: false,   // ❗ localhost
      sameSite: "lax",
    });

    return res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
