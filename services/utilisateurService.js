import bcrypt from 'bcrypt';
import { db } from '../firebase.js';

export const creerCompte = async (utilisateurData) => {
    if (!utilisateurData.motDePasse) {
        throw new Error('Mot de passe non fourni');
    }
    try {
        const hashedPassword = await bcrypt.hash(utilisateurData.motDePasse, 10);
        utilisateurData.motDePasse = hashedPassword;

        const userRef = db.collection('Utilisateurs').doc();
        await userRef.set(utilisateurData);
        return { id: userRef.id, ...utilisateurData };
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe:', error);
        throw new Error('Erreur serveur lors de la création du compte');
    }
};

export const supprimerUtilisateur = async (userId) => {
    await db.collection('Utilisateurs').doc(userId).delete();
};

export const getUserById = async (userId) => {
    const userRef = db.collection('Utilisateurs').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new Error('Utilisateur non trouvé');
    }

    return { id: doc.id, ...doc.data() };
};

export const getUtilisateurs = async () => {
    try {
        console.log('getUtilisateurs service called');  // Log pour indiquer que le service a été appelé
        const usersRef = db.collection('Utilisateurs');
        const snapshot = await usersRef.get();
        if (snapshot.empty) {
            console.log('No utilisateurs found');  // Log si aucun utilisateur n'est trouvé
            return [];
        }
        console.log('Utilisateurs found:', snapshot.docs.length);  // Log le nombre d'utilisateurs trouvés
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Erreur dans getUtilisateurs service:', error.message);  // Log en cas d'erreur
        throw error;
    }
};

export const getUtilisateursAvertis = async () => {
    try {
        console.log('getUtilisateursAvertis service called');
        const warnedUsersSnapshot = await db.collection('Notifications').where('type', '==', 'Avertissement').get();
        if (warnedUsersSnapshot.empty) {
            console.log('No utilisateurs avertis found');
            return [];
        }

        const utilisateursPromises = warnedUsersSnapshot.docs.map(async doc => {
            const utilisateurDoc = await db.collection('Utilisateurs').doc(doc.data().utilisateurId).get();
            if (!utilisateurDoc.exists) {
                console.log(`Utilisateur non trouvé pour l'ID: ${doc.data().utilisateurId}`);
                return null;
            }
            return {
                ...doc.data(),
                utilisateurNom: utilisateurDoc.data().nom,
                utilisateurEmail: utilisateurDoc.data().email
            };
        });

        const utilisateursAvertis = await Promise.all(utilisateursPromises);
        console.log('Utilisateurs avertis found:', utilisateursAvertis.filter(user => user !== null).length);
        return utilisateursAvertis.filter(user => user !== null);
    } catch (error) {
        console.error('Erreur dans getUtilisateursAvertis service:', error.message);
        throw error;
    }
};

export default {
    getUtilisateurs,
    creerCompte,
    supprimerUtilisateur,
    getUserById,
    getUtilisateursAvertis,
};
