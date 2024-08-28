// adminService.js using ES6 module syntax
import { db } from '../firebase.js';

export const getUtilisateurs = async () => {
    const usersRef = db.collection('Utilisateurs');
    const snapshot = await usersRef.get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const supprimerUtilisateur = async (utilisateurId) => {
    await db.collection('Utilisateurs').doc(utilisateurId).delete();
};

export const avertirUtilisateur = async (utilisateurId, message) => {
    const notificationRef = db.collection('Notifications').doc();
    const notificationData = {
        utilisateurId,
        message,
        dateEnvoi: new Date(),
        type: 'Avertissement',
    };
    await notificationRef.set(notificationData);
    return { id: notificationRef.id, ...notificationData };
};
