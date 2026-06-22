import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "Not authorized. login again." });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: token_decode.id }; // ✅ FIX
    next();
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export default authUser;
