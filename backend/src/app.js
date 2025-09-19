import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";

// your existing user routes
import userRoutes from "./routes/users.routes.js";

// ✅ new routes
import authRoutes from "./routes/auth.routes.js";
import recordingsRoutes from "./routes/recordings.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

import leaderboardRoutes from "./routes/leaderboard.routes.js";
import qnaRoutes from "./routes/qna.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// existing user routes
app.use("/api/v1/users", userRoutes);

// ✅ mount new routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recordings", recordingsRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/qna", qnaRoutes);
app.use("/api/v1/attendance", attendanceRoutes);

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://vineshgoswami45_db_user:O4upcYOrnlXmNE78@cluster0.skq1hww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server listening on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  }
};

start();
