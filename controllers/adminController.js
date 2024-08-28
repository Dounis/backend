// adminController.js
import { getUtilisateurs, avertirUtilisateur as serviceAvertirUtilisateur, supprimerUtilisateur as serviceSupprimerUtilisateur } from '../services/adminService.js';

export const afficherUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await getUtilisateurs();
        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs: ' + error.message });
    }
};

export const supprimerUtilisateur = async (req, res) => {
    try {
        const { utilisateurId } = req.params;
        await serviceSupprimerUtilisateur(utilisateurId);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du compte utilisateur: ' + error.message });
    }
};

export const avertirUtilisateur = async (req, res) => {
    try {
        const { utilisateurId } = req.params;
        const { message } = req.body;
        await serviceAvertirUtilisateur(utilisateurId, message);
        res.status(200).json({ message: 'Avertissement envoyé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'envoi du message: ' + error.message });
    }
};

export const envoyerAvertissement = async (req, res) => {
    try {
      const { utilisateurId, message } = req.body;
  
      // Envoyer la notification
      await notifyUser(
        utilisateurId,
        message,
        'avertissement',
        null // Pas de relation directe avec une question ou une réponse
      );
  
      res.status(200).json({ message: 'Avertissement envoyé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'avertissement' });
    }
  };
  