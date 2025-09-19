import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { ask } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/ask", authMiddleware, ask);

export default router;
