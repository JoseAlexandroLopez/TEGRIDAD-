import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Rutas totalmente públicas y directas
router.post('/register', register);
router.post('/login', login);

export default router;