
// notificationModel.js
import { db } from '../firebase.js';

// Fonction pour créer une notification dans la base de données
export const createNotification = async (data) => {
    try {
        const notificationRef = db.collection('Notifications').doc();
        await notificationRef.set({
            ...data,
            dateEnvoi: new Date().toISOString(),
        });
        console.log('Notification créée avec succès:', notificationRef.id);
        return notificationRef.id;
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error);
        throw error;
    }
};

// Fonction pour récupérer les notifications d'un utilisateur
export const findByUserId = async (userId) => {
    console.log("Recherche des notifications pour l'utilisateur :", userId);
    const snapshot = await db.collection('Notifications')
        .where('utilisateurId', '==', userId)
        .orderBy('dateEnvoi', 'desc')
        .get();

    if (snapshot.empty) {
        console.log("Aucune notification trouvée pour l'utilisateur :", userId);
        return [];
    }

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Notifications trouvées :", notifications);
    return notifications;
};

// Fonction pour marquer une notification comme lue
export const markNotificationAsRead = async (notificationId) => {
    try {
        const notificationRef = db.collection('Notifications').doc(notificationId);
        await notificationRef.update({ vue: true });
        console.log('Notification marquée comme lue:', notificationId);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error);
        throw error;
    }
};
