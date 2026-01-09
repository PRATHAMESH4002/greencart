import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* -------------------------------
   REGISTER SELLER
-------------------------------- */
export const registerSeller = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.json({ success: false, message: "Seller already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      name,
      email,
      password: hashedPassword,
      isApproved: true,
    });

    await seller.save();

    return res.json({
      success: true,
      message: "Seller registered successfully",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

/* -------------------------------
   LOGIN SELLER
-------------------------------- */
export const loginSeller = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!seller.isApproved) {
      return res.json({
        success: false,
        message: "Seller not approved yet",
      });
    }

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
