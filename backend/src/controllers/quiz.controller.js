// src/controllers/quiz.controller.js
import Quiz from "../models/quiz.model.js";

// ✅ Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions });
    await quiz.save();
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all quizzes
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Submit quiz (store answers)
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Basic correctness check (just comparing options)
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctOption === answers[i]) score++;
    });

    res.status(200).json({ message: "Quiz submitted", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
