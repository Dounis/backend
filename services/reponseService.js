
import { db, FieldValue } from '../firebase.js';
import { notifyUser } from '../services/notificationService.js';

export const ajouterReponse = async (questionId, texte, utilisateurId, imageId) => {
    const reponseRef = db.collection('Questions').doc(questionId).collection('Reponses').doc();
    const reponseData = {
        texte,
        utilisateurId,
        imageId,
        datePublication: new Date(),
    };

    await reponseRef.set(reponseData);

    // Incrémenter le nombre de commentaires dans la question
    await db.collection('Questions').doc(questionId).update({
        commentaires: FieldValue.increment(1),
    });

    // Envoyer une notification à l'auteur de la question
    const questionDoc = await db.collection('Questions').doc(questionId).get();
    const questionData = questionDoc.data();

    if (questionData && questionData.utilisateurId !== utilisateurId) {
        await notifyUser(
            questionData.utilisateurId,
            'Votre question a reçu une nouvelle réponse !',
            'response',
            questionId,
            reponseRef.id
        );
    }

    return { id: reponseRef.id, ...reponseData };
};

export const getReponses = async (questionId) => {
    const snapshot = await db.collection('Questions').doc(questionId).collection('Reponses').orderBy('datePublication', 'desc').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const toggleLikeDislikeReponse = async (questionId, reponseId, utilisateurId, action) => {
    try {
        const reponseRef = db.collection('Questions').doc(questionId).collection('Reponses').doc(reponseId);
        const userLikesRef = reponseRef.collection('UserLikes').doc(utilisateurId);

        const userLikeDoc = await userLikesRef.get();
        const reponseDoc = await reponseRef.get();

        if (!reponseDoc.exists) {
            throw new Error('Réponse non trouvée');
        }

        let updateData = {};
        const currentLikes = reponseDoc.data().likes || 0;

        if (!userLikeDoc.exists) {
            if (action === 'like') {
                updateData['likes'] = FieldValue.increment(1);
            }
            await userLikesRef.set({ action });
        } else {
            const currentAction = userLikeDoc.data().action;

            if (currentAction === action) {
                if (action === 'like' && currentLikes > 0) {
                    updateData['likes'] = FieldValue.increment(-1);
                }
                await userLikesRef.delete();
            } else {
                if (action === 'like') {
                    updateData['likes'] = FieldValue.increment(1);
                }
                await userLikesRef.set({ action });
            }
        }

        await reponseRef.update(updateData);
        console.log(`${action} mis à jour avec succès pour la réponse ${reponseId}`);
    } catch (error) {
        console.error(`Erreur dans ${action}:`, error);
        throw error;
    }
};

export const repondreQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { texte, utilisateurId, imageId } = req.body;

        const reponse = await ajouterReponse(questionId, texte, utilisateurId, imageId);

        console.log('Réponse ajoutée:', reponse);

        const questionDoc = await db.collection('Questions').doc(questionId).get();
        const questionData = questionDoc.data();

        console.log('Données de la question:', questionData);

        if (questionData && questionData.utilisateurId !== utilisateurId) {
            await notifyUser(
                questionData.utilisateurId,
                'Votre question a reçu une nouvelle réponse !',
                'response',
                questionId,
                reponse.id
            );
            console.log('Notification envoyée à:', questionData.utilisateurId);
        }

        res.status(201).json(reponse);
    } catch (error) {
        console.error("Erreur lors de la réponse à la question:", error);
        res.status(500).json({ message: "Erreur lors de la réponse à la question." });
    }
};
