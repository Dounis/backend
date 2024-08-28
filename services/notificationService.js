import { db } from '../firebase.js';
import { createNotification } from '../models/notificationModel.js';

// Fonction pour envoyer une notification
const sendNotification = async ({ utilisateurId, type, message, questionId = null, reponseId = null }) => {
    const notificationRef = db.collection('Notifications').doc();
    const notificationData = {
        utilisateurId,
        type,
        message,
        dateEnvoi: new Date(),
        questionId,
        reponseId
    };

    await notificationRef.set(notificationData);
    return { id: notificationRef.id, ...notificationData };
};

// Fonction pour récupérer les notifications pour un utilisateur
const getNotifications = async (utilisateurId) => {
    const notificationsRef = db.collection('Notifications');
    const snapshot = await notificationsRef.where('utilisateurId', '==', utilisateurId).get();
    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour notifier un utilisateur
export const notifyUser = async (userId, message, type, questionId = null, reponseId = null) => {
    try {
        console.log(`Tentative de création de notification pour l'utilisateur ${userId}`);
        const notificationId = await createNotification({
            utilisateurId: userId,
            message,
            type,
            questionId,
            reponseId,
            vue: false, // Indique que la notification n'a pas encore été vue
        });
        console.log('Notification créée avec succès pour l\'utilisateur', userId, 'avec ID:', notificationId);
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error.message);
    }
};

// Fonction pour marquer une notification comme lue dans la base de données
export const markAsReadInDB = async (notificationId) => {
    try {
        const notificationRef = db.collection('Notifications').doc(notificationId);
        await notificationRef.update({ vue: true });
    } catch (error) {
        throw new Error('Failed to mark notification as read: ' + error.message);
    }
};

// Fonction pour récupérer les notifications par utilisateur ID
export const findNotificationsByUserId = async (userId) => {
    const notificationsRef = db.collection('Notifications');
    const snapshot = await notificationsRef.where('utilisateurId', '==', userId).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// notificationService.js
export const sendAdminWarning = async (utilisateurId, message) => {
    try {
        console.log(`Envoi d'un avertissement à l'utilisateur ${utilisateurId}`);

        if (!utilisateurId || !message) {
            throw new Error('Utilisateur ID ou message manquant');
        }

        const notificationId = await createNotification({
            utilisateurId,
            type: 'Avertissement',
            message,
            vue: false,
        });

        console.log('Avertissement envoyé avec succès à l\'utilisateur', utilisateurId, 'avec ID:', notificationId);
        return notificationId;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'avertissement:', error.message);
        throw error;
    }
};

export default {
    sendNotification,
    getNotifications,
};
