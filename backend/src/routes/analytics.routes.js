import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { overview } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/overview", authMiddleware, overview);

export default router;
