import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    cartItems: {
      type: Object,
      default: {}
    },

    // 🔐 OTP fields for 2-step login
    otp: {
      type: String,
      default: null
    },

    otpExpiry: {
      type: Date,
      default: null
    }
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", UserSchema);
export default User;
