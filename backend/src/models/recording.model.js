import mongoose from "mongoose";

const RecordingSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
  filepath: { type: String, required: true },
  size: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  summary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Recording = mongoose.model("Recording", RecordingSchema);

export default Recording;
