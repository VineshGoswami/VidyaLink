import mongoose from "mongoose";

const RecordingSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
  filepath: { type: String, required: true },
  size: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  summary: { type: String, default: "" },
  title: { type: String, default: "Untitled Recording" },
  description: { type: String, default: "" },
  url: { type: String, default: "" },
  subject: { type: String, default: "" },
  educator: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  views: { type: Number, default: 0 },
  quality: { type: String, default: "SD" },
  watchProgress: { type: Number, default: 0 },
  isOfflineAvailable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Recording = mongoose.model("Recording", RecordingSchema);

export default Recording;
