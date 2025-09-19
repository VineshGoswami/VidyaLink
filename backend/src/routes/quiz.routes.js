// src/routes/quiz.routes.js
import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createQuiz, getQuizzes, submitQuiz } from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/create", auth, createQuiz);
router.get("/", auth, getQuizzes);
router.post("/submit/:id", auth, submitQuiz);

export default router; // ✅ default export
