import multer from "multer";
import path from "path";
import fs from "fs";
import Recording from "../models/recording.model.js";
import Meeting from "../models/meeting.model.js";
import { compressToMp3 } from "../services/compression.service.js";
import axios from "axios";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

export const uploadMiddleware = multer({ storage }).single("file");

export const uploadRecording = async (req, res) => {
  try {
    const file = req.file;
    const lectureId = req.body.lectureId;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    // compress to mp3
    const outName = "compressed-" + file.filename + ".mp3";
    const outPath = path.join(path.dirname(file.path), outName);
    await compressToMp3(file.path, outPath);

    const stats = fs.statSync(outPath);
    const rec = new Recording({
      lecture: lectureId,
      filepath: outPath,
      size: stats.size,
      duration: 0
    });
    await rec.save();

    // optional summarizer call
    (async () => {
      try {
        const resp = await axios.post(process.env.AI_SUMMARIZER_URL, { text: "" });
        if (resp.data && resp.data.summary) {
          rec.summary = resp.data.summary;
          await rec.save();
        }
      } catch (e) {
        console.warn("Summarizer call failed", e.message);
      }
    })();

    res.json({ recording: rec });
  } catch (err) {
    console.error("uploadRecording err", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const listRecordings = async (req, res) => {
  try {
    const recs = await Recording.find().populate("lecture", "title");
    res.json(recs);
  } catch (err) {
    console.error("listRecordings err", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const downloadRecording = async (req, res) => {
  try {
    const rec = await Recording.findById(req.params.id);
    if (!rec) return res.status(404).json({ msg: "Recording not found" });
    return res.download(rec.filepath);
  } catch (err) {
    console.error("downloadRecording err", err);
    res.status(500).json({ msg: "Server error" });
  }
};
