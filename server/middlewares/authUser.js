import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  // 1️⃣ Try to get token from cookie
  let token = req.cookies?.token;

  // 2️⃣ If not in cookie, get from Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authUser;
