import { db } from '../firebase.js';

export const getHistoriques = async (utilisateurId) => {
    const predictionsRef = db.collection('Prediction');
    const snapshot = await predictionsRef.where('utilisateurId', '==', utilisateurId).get();
    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
