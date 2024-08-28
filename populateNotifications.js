import { db } from './firebase.js';
import { createNotification } from './models/notificationModel.js';

export const populateNotifications = async () => {
    try {
        const questionsSnapshot = await db.collection('Questions').get();
        const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const question of questions) {
            const { utilisateurId: auteurId, id: questionId } = question;

            // Gérer les likes
            const likesSnapshot = await db.collection('Questions').doc(questionId).collection('UserLikes').where('action', '==', 'like').get();
            for (const likeDoc of likesSnapshot.docs) {
                const { utilisateurId } = likeDoc.data();
                if (utilisateurId !== auteurId) {
                    const existingNotification = await db.collection('Notifications')
                        .where('utilisateurId', '==', auteurId)
                        .where('questionId', '==', questionId)
                        .where('type', '==', 'like')
                        .get();

                    if (existingNotification.empty) {
                        await createNotification({
                            utilisateurId: auteurId,
                            message: 'Votre question a reçu un like !',
                            type: 'like',
                            questionId,
                            reponseId: null,
                            dateEnvoi: new Date().toISOString(),
                            vue: false,
                        });
                    }
                }
            }

            // Gérer les dislikes
            const dislikesSnapshot = await db.collection('Questions').doc(questionId).collection('UserLikes').where('action', '==', 'dislike').get();
            for (const dislikeDoc of dislikesSnapshot.docs) {
                const { utilisateurId } = dislikeDoc.data();
                if (utilisateurId !== auteurId) {
                    const existingNotification = await db.collection('Notifications')
                        .where('utilisateurId', '==', auteurId)
                        .where('questionId', '==', questionId)
                        .where('type', '==', 'dislike')
                        .get();

                    if (existingNotification.empty) {
                        await createNotification({
                            utilisateurId: auteurId,
                            message: 'Votre question a reçu un dislike !',
                            type: 'dislike',
                            questionId,
                            reponseId: null,
                            dateEnvoi: new Date().toISOString(),
                            vue: false,
                        });
                    }
                }
            }

            // Gérer les réponses
            const reponsesSnapshot = await db.collection('Questions').doc(questionId).collection('Reponses').get();
            for (const reponseDoc of reponsesSnapshot.docs) {
                const { utilisateurId } = reponseDoc.data();
                if (utilisateurId !== auteurId) {
                    const existingNotification = await db.collection('Notifications')
                        .where('utilisateurId', '==', auteurId)
                        .where('questionId', '==', questionId)
                        .where('reponseId', '==', reponseDoc.id)
                        .where('type', '==', 'response')
                        .get();

                    if (existingNotification.empty) {
                        await createNotification({
                            utilisateurId: auteurId,
                            message: 'Votre question a reçu une nouvelle réponse !',
                            type: 'response',
                            questionId,
                            reponseId: reponseDoc.id,
                            dateEnvoi: new Date().toISOString(),
                            vue: false,
                        });
                    }
                }
            }
        }

        console.log('Notifications créées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la création des notifications:', error);
    }
};
