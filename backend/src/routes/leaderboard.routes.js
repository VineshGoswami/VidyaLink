import express from 'express';
import { getTop } from '../controllers/leaderboard.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/top', authMiddleware, getTop);

export default router;
