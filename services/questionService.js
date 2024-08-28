import { db, FieldValue } from '../firebase.js';

import { enregistrerImage } from './imageService.js';

export const ajouterQuestion = async (titre, description, utilisateurId, imageBase64) => {
    // Vérifiez que l'image est fournie
    if (!imageBase64) {
        throw new Error("L'image est obligatoire pour poser une question.");
    }

    // Enregistrez l'image si elle est fournie
    const imageData = await enregistrerImage(imageBase64, utilisateurId);
    const imageId = imageData.id;

    const questionRef = db.collection('Questions').doc();
    const questionData = {
        titre,
        description,
        utilisateurId,
        imageId,
        datePublication: new Date(),
        likes: 0,
        dislikes: 0,
        commentaires: 0,
    };

    await questionRef.set(questionData);
    return { id: questionRef.id, ...questionData };
};

export const getQuestions = async () => {
    try {
        const snapshot = await db.collection('Questions').orderBy('datePublication', 'desc').get();
        console.log("Nombre de documents récupérés:", snapshot.docs.length); // Log pour vérifier la récupération

        // Utilisation de Promise.all pour attendre toutes les promesses
        const questions = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            console.log("Données du document:", data); // Log pour voir les données brutes

            if (data.imageId) {
                const imageDoc = await db.collection('Images').doc(data.imageId).get();
                data.imageBase64 = imageDoc.exists ? imageDoc.data().imageBase64 : null;
            }

            return { id: doc.id, ...data };
        }));

        return questions;
    } catch (error) {
        console.error("Erreur lors de la récupération des questions:", error);
        throw error;
    }
};

export const toggleLikeDislike = async (questionId, utilisateurId, action) => {
    try {
        const questionRef = db.collection('Questions').doc(questionId);
        const userLikesRef = questionRef.collection('UserLikes').doc(utilisateurId);

        const userLikeDoc = await userLikesRef.get();
        const questionDoc = await questionRef.get();

        if (!questionDoc.exists) {
            throw new Error('Question not found');
        }

        let updateData = {};
        const currentLikes = questionDoc.data().likes || 0;
        const currentDislikes = questionDoc.data().dislikes || 0;

        if (!userLikeDoc.exists) {
            // If user hasn't liked or disliked yet
            if (action === 'like') {
                updateData['likes'] = FieldValue.increment(1);
            } else if (action === 'dislike') {
                updateData['dislikes'] = FieldValue.increment(1);
            }
            await userLikesRef.set({ action });
        } else {
            const currentAction = userLikeDoc.data().action;

            if (currentAction === action) {
                // User cancels their current action
                if (action === 'like' && currentLikes > 0) {
                    updateData['likes'] = FieldValue.increment(-1);
                } else if (action === 'dislike' && currentDislikes > 0) {
                    updateData['dislikes'] = FieldValue.increment(-1);
                }
                await userLikesRef.delete();
            } else {
                // User switches from like to dislike or vice versa
                if (currentAction === 'like' && currentLikes > 0) {
                    updateData['likes'] = FieldValue.increment(-1);
                } else if (currentAction === 'dislike' && currentDislikes > 0) {
                    updateData['dislikes'] = FieldValue.increment(-1);
                }

                if (action === 'like') {
                    updateData['likes'] = FieldValue.increment(1);
                } else if (action === 'dislike') {
                    updateData['dislikes'] = FieldValue.increment(1);
                }
                await userLikesRef.set({ action });
            }
        }

        await questionRef.update(updateData);
        console.log(`${action} successfully updated for question ${questionId}`);
    } catch (error) {
        console.error(`Error in ${action}:`, error);
        throw error;
    }
};
