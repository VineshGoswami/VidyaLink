import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  join,
  leave
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/join", authMiddleware, join);
router.post("/leave", authMiddleware, leave);

export default router;
