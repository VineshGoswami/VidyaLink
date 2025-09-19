import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const header = req.header("Authorization") || req.header("authorization");
  if (!header) return res.status(401).json({ msg: "No token provided" });

  const token = header.split(" ")[1] || header;
  if (!token) return res.status(401).json({ msg: "Token malformed" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fix: The payload contains the ID directly, not nested in a user object
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("JWT error", err);
    return res.status(401).json({ msg: "Token invalid" });
  }
};

export default authMiddleware;
