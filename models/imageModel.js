import { db } from '../firebase.js';

export const create = async (imageData) => {
    const imageRef = db.collection('Images').doc();
    await imageRef.set(imageData);
    return { id: imageRef.id, ...imageData };
};

export const findById = async (imageId) => {
    const doc = await db.collection('Images').doc(imageId).get();
    if (!doc.exists) {
        return null;
    }

    return { id: doc.id, ...doc.data() };
};
