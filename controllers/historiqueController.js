// historiqueController.js
import { getHistoriques } from '../services/historiqueService.js';

// Consulter les historiques permet à un utilisateur de consulter son historique des analyses
export const consulterHistoriques = async (req, res) => {
    try {
        const utilisateurId = req.user.id; // Assure-toi que req.user contient l'ID de l'utilisateur
        const historiques = await getHistoriques(utilisateurId);
        res.status(200).json(historiques);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique: ' + error.message });
    }
};
