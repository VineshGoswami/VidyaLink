import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, sparse: true, unique: true }, // For backward compatibility
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  token: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

export default User;
