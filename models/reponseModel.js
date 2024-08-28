import { db } from '../firebase.js';

export const create = async (questionId, reponseData) => {
    const reponseRef = db.collection('Questions').doc(questionId).collection('Reponses').doc();
    await reponseRef.set(reponseData);
    return { id: reponseRef.id, ...reponseData };
};

export const findByQuestionId = async (questionId) => {
    const snapshot = await db.collection('Questions').doc(questionId).collection('Reponses').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
