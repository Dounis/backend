import { db } from '../firebase.js';

export const create = async (questionData) => {
    const questionRef = db.collection('Questions').doc();
    await questionRef.set(questionData);
    return { id: questionRef.id, ...questionData };
};

export const findAll = async () => {
    const snapshot = await db.collection('Questions').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
