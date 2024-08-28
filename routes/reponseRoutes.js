import express from 'express';
import { consulterReponses, likerReponse, repondreQuestion } from '../controllers/reponseController.js';
//import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//router.post('/:questionId/reponses', protect, repondreQuestion);
//router.get('/:questionId/reponses', protect, consulterReponses);

// Routes pour les réponses
router.post('/questions/:questionId/reponses', repondreQuestion);
router.get('/questions/:questionId/reponses', consulterReponses);
router.post('/:questionId/reponses/:reponseId/like', likerReponse);

export default router;
