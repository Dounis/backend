import { ajouterReponse, getReponses, toggleLikeDislikeReponse } from '../services/reponseService.js';

export const consulterReponses = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const reponses = await getReponses(questionId);
        res.status(200).json(reponses);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des réponses à la question: ' + error.message });
    }
};

export const likerReponse = async (req, res) => {
    try {
        const { questionId, reponseId } = req.params;
        const utilisateurId = req.body.utilisateurId;
        await toggleLikeDislikeReponse(questionId, reponseId, utilisateurId, 'like');
        res.status(200).json({ message: 'Like mis à jour avec succès pour la réponse' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du like à la réponse: ' + error.message });
    }
};

export const repondreQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { texte, utilisateurId, imageId } = req.body;

        const reponse = await ajouterReponse(questionId, texte, utilisateurId, imageId);
        res.status(201).json(reponse);
    } catch (error) {
        console.error("Erreur lors de la réponse à la question:", error);
        res.status(500).json({ message: "Erreur lors de la réponse à la question." });
    }
};
