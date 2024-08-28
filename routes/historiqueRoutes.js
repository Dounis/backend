import express from 'express';
import { consulterHistoriques } from '../controllers/historiqueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, consulterHistoriques);

export default router;
