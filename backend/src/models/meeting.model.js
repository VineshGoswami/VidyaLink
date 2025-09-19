import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
