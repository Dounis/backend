// utilisateurRoutes.js
import express from 'express';
import { creerCompte, getUserById, getUtilisateur, getUtilisateurs, getUtilisateursAvertis, supprimerUtilisateur } from '../controllers/utilisateurController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { sendAdminWarning } from '../services/notificationService.js';

const router = express.Router();

router.post('/', (req, res, next) => {
    console.log('Route POST /api/utilisateurs hit');
    next();
}, creerCompte);

router.delete('/:id', protect, adminOnly, (req, res, next) => {
    console.log(`Route DELETE /api/utilisateurs/${req.params.id} hit`);
    next();
}, supprimerUtilisateur);

// La route pour les utilisateurs avertis doit être définie avant la route avec :id
router.get('/avertis', (req, res, next) => {
    console.log('Route GET /api/utilisateurs/avertis hit');
    next();
}, protect, adminOnly, getUtilisateursAvertis);

router.get('/:id', protect, (req, res, next) => {
    console.log(`Route GET /api/utilisateurs/${req.params.id} hit`);
    next();
}, getUserById);

router.post('/:id/avertir', protect, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    try {
        console.log(`Route POST /api/utilisateurs/${id}/avertir hit with message:`, message);
        await sendAdminWarning(id, message);
        res.status(200).json({ message: 'Avertissement envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'avertissement:', error.message);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'avertissement: ' + error.message });
    }
});

router.get('/', protect, adminOnly, getUtilisateurs);

export default router;
