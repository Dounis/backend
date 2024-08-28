import express from 'express';
import { authentifier, getCurrentUserId } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authentifier);
router.get('/current-user', protect, getCurrentUserId);

export default router;

