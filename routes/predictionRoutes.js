import express from 'express';
import { consulterPredictions, detecterCarences, getPredictionsByUser } from '../controllers/predictionController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour effectuer une prédiction sur une image
router.post('/detecter', detecterCarences);

// Route pour consulter les prédictions d'un utilisateur spécifique
router.get('/user/:utilisateurId', protect, adminOnly, getPredictionsByUser);

// Route pour consulter toutes les prédictions (réservée à l'administrateur)
router.get('/', protect, adminOnly, consulterPredictions);

export default router;
