import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  uploadMiddleware,
  uploadRecording,
  listRecordings,
  downloadRecording
} from "../controllers/recordings.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadMiddleware, uploadRecording);
router.get("/list", authMiddleware, listRecordings);
router.get("/download/:id", authMiddleware, downloadRecording);

export default router;
