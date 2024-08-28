import { notifyUser } from '../services/notificationService.js'; // Importation du service de notification
import { ajouterQuestion, getQuestions, toggleLikeDislike } from '../services/questionService.js';

export const poserQuestion = async (req, res) => {
    try {
        console.log("Données reçues:", req.body);

        const { titre, description, utilisateurId, imageBase64 } = req.body;

        console.log("Image Base64:", imageBase64);  // Vérifiez si `imageBase64` est bien reçu

        if (!titre || !description || !utilisateurId || !imageBase64) {
            console.log("Champs requis manquants");
            return res.status(400).json({ message: "Tous les champs requis ne sont pas fournis." });
        }

        const question = await ajouterQuestion(titre, description, utilisateurId, imageBase64);

        console.log("Question ajoutée avec succès:", question.id);
        res.status(201).json({ id: question.id });
    } catch (error) {
        console.error("Erreur lors de la soumission de la question:", error);
        res.status(500).json({ message: "Erreur lors de la soumission de la question." });
    }
};

export const consulterQuestions = async (req, res) => {
    try {
        const questions = await getQuestions();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des questions: ' + error.message });
    }
};

export const likerQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const utilisateurId = req.body.utilisateurId;

        // Appeler la fonction pour liker la question
        await toggleLikeDislike(questionId, utilisateurId, 'like');

        // Récupérer les informations de la question et de son auteur
        const questionDoc = await db.collection('Questions').doc(questionId).get();
        const questionData = questionDoc.data();

        // Si l'utilisateur qui like la question n'est pas l'auteur de la question
        if (questionData && questionData.utilisateurId !== utilisateurId) {
            // Envoyer une notification à l'auteur de la question
            await notifyUser(
                questionData.utilisateurId,
                'Votre question a reçu un like !',
                'like',
                questionId
            );
        }

        res.status(200).json({ message: 'Like mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors du like de la question:', error);
        res.status(500).json({ message: 'Erreur lors du like de la question' });
    }
};

// questionController.js

export const dislikerQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const utilisateurId = req.body.utilisateurId;

        // Appeler la fonction pour disliker la question
        await toggleLikeDislike(questionId, utilisateurId, 'dislike');

        // Récupérer les informations de la question et de son auteur
        const questionDoc = await db.collection('Questions').doc(questionId).get();
        const questionData = questionDoc.data();

        // Si l'utilisateur qui dislike la question n'est pas l'auteur de la question
        if (questionData && questionData.utilisateurId !== utilisateurId) {
            // Envoyer une notification à l'auteur de la question
            await notifyUser(
                questionData.utilisateurId,
                'Votre question a reçu un dislike !',
                'dislike',
                questionId
            );
        }

        res.status(200).json({ message: 'Dislike mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors du dislike de la question:', error);
        res.status(500).json({ message: 'Erreur lors du dislike de la question' });
    }
};
