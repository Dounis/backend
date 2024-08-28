import * as imageService from '../services/imageService.js';
import * as predictionService from '../services/predictionService.js';

export const consulterPredictions = async (req, res) => {
    try {
        const predictions = await predictionService.getAllPredictions();
        if (!predictions || predictions.length === 0) {
            return res.status(404).json({ message: 'Aucune prédiction trouvée.' });
        }
        res.status(200).json(predictions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des prédictions: ' + error.message });
    }
};

export const detecterCarences = async (req, res) => {
    try {
        const { image, utilisateurId } = req.body;

        if (!image || !utilisateurId) {
            return res.status(400).json({ message: "L'image ou l'ID utilisateur est manquant" });
        }

        console.log('Received image:', !!image);
        console.log('Received utilisateurId:', utilisateurId ? 'Yes utilisateurId' : 'No utilisateurId');

        // Enregistrez l'image et la prédiction dans Firestore
        const imageData = await imageService.enregistrerImage(image, utilisateurId);
        const resultats = await predictionService.detecterCarences(image, utilisateurId);

        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la détection des carences :', error.message);
        res.status(500).json({ message: 'Erreur lors de la détection des carences: ' + error.message });
    }
};

// Ajouter cette fonction dans votre predictionController.js
export const getPredictionsByUser = async (req, res) => {
    try {
        const { utilisateurId } = req.params;
        const predictions = await predictionService.getPredictionsByUser(utilisateurId);
        res.status(200).json(predictions);
    } catch (error) {
        console.error('Erreur lors de la récupération des prédictions :', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des prédictions: ' + error.message });
    }
};
