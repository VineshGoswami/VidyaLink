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
import videoConferenceRoutes from "./routes/videoConference.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import leaderboardRoutes from "./routes/leaderboard.routes.js";
import qnaRoutes from "./routes/qna.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8001);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4028',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
app.use("/api/v1/video-conference", videoConferenceRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://vineshgoswami45_db_user:O4upcYOrnlXmNE78@cluster0.skq1hww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);

    // Try to listen on the configured port, if it fails, try alternative ports
    const tryListen = (port) => {
      return new Promise((resolve, reject) => {
        const serverInstance = server.listen(port)
          .on('listening', () => {
            console.log(`🚀 Server listening on port ${port}`);
            resolve(serverInstance);
          })
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`⚠️ Port ${port} is already in use, trying next port...`);
              serverInstance.close();
              resolve(false);
            } else {
              reject(err);
            }
          });
      });
    };

    // Try the default port first, then try alternatives
    const defaultPort = app.get("port");
    const alternativePorts = [8002, 8003, 8004, 8005];
    
    let serverStarted = await tryListen(defaultPort);
    
    if (!serverStarted) {
      for (const port of alternativePorts) {
        serverStarted = await tryListen(port);
        if (serverStarted) {
          // Update the app port setting to the one that worked
          app.set("port", port);
          break;
        }
      }
      
      if (!serverStarted) {
        console.error("❌ Could not find an available port. Please free up port 8001 or specify a different port in the .env file.");
        process.exit(1);
      }
    }
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  }
};

start();
