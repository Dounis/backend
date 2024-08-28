// adminRoutes.js
import express from 'express';
import { afficherUtilisateurs, avertirUtilisateur } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour afficher tous les utilisateurs
router.get('/utilisateurs', protect, adminOnly, afficherUtilisateurs);

// Route pour avertir un utilisateur spécifique
router.post('/utilisateurs/:id/avertir', protect, adminOnly, avertirUtilisateur);

export default router;
