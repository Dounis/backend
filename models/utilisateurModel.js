import { db } from '../firebase.js';

export const create = async (userData) => {
    const userRef = db.collection('Utilisateurs').doc();
    await userRef.set(userData);
    return { id: userRef.id, ...userData };
};

export const findByEmail = async (email) => {
    const snapshot = await db.collection('Utilisateurs').where('email', '==', email).get();
    if (snapshot.empty) {
        return null;
    }

    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const deleteId = async (userId) => {
    await db.collection('Utilisateurs').doc(userId).delete();
};
