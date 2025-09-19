import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  instructor: { type: String },
  subject: { type: String },
  user_id: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  connectionQuality: { type: String, enum: ['good', 'fair', 'poor'], default: 'good' },
  bandwidthRequirement: { type: String, default: '512 Kbps' },
  enrolledStudents: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 30 },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
