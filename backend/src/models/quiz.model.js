// src/models/quiz.model.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOption: { type: Number, required: true }, // index of correct answer
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", quizSchema);

// ✅ default export so you can `import Quiz from ...`
export default Quiz;
