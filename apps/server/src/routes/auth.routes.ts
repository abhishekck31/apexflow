import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// This makes the full path: /api/auth/login
router.post('/login', login);

export default router;