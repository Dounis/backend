import express from 'express';
import { consulterQuestions, dislikerQuestion, likerQuestion, poserQuestion } from '../controllers/questionController.js';
import { consulterReponses, repondreQuestion } from '../controllers/reponseController.js'; // Import depuis reponseController.js

const router = express.Router();

router.post('/', poserQuestion); // Pour poser une question
router.get('/', consulterQuestions); // Pour consulter les questions
router.post('/:id/like', likerQuestion); // Pour liker une question
router.post('/:id/dislike', dislikerQuestion); // Pour disliker une question
router.post('/:questionId/reponses', repondreQuestion); // Pour ajouter une réponse
router.get('/:questionId/reponses', consulterReponses); // Pour consulter les réponses

export default router;
