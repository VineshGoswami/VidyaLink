// src/routes/quiz.routes.js
import { Router } from "express";
import { createQuiz, getQuizzes, submitQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.post("/", createQuiz);
router.get("/", getQuizzes);
router.post("/submit", submitQuiz);

export default router;
