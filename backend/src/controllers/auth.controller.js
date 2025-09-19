// src/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ---------------- Register ----------------
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role if provided
    const userData = { 
      name, 
      email, 
      password: hashedPassword,
      username: email.split('@')[0] + Math.floor(Math.random() * 1000) // Generate a unique username
    };
    
    // Validate and set role
    if (role && ['student', 'teacher', 'admin'].includes(role)) {
      userData.role = role;
    }

    // Create and save user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_123', { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `A user with this ${field} already exists` 
      });
    }
    
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // Update user role if provided
    if (role && ['student', 'teacher', 'admin'].includes(role)) {
      user.role = role;
      await user.save();
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Get current user ----------------
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Return user with specific fields to ensure consistent data structure
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
