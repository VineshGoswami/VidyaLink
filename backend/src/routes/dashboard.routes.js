import express from "express";
import { getStudentDashboard, getEducatorDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/student", getStudentDashboard);
router.get("/educator", getEducatorDashboard);

export default router;