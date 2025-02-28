import { Router } from "express";
import { authenticateUser, registerUser, getUserProfile } from "../services/authService";

const router = Router();

router.post('/login', authenticateUser);

router.post('/register', registerUser);

router.post('/profile', getUserProfile);

export default router;