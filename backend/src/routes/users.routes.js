import { Router } from "express";
import { addToHistory, getUserHistory, login, register, updateProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
router.route("/profile").put(authMiddleware, updateProfile);

export default router;