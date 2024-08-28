import { db } from '../firebase.js';

export const enregistrerImage = async (imageBase64, utilisateurId) => {
    const imageRef = db.collection('Images').doc();
    const imageData = {
        imageBase64,
        dateUpload: new Date(),
        utilisateurId,
    };

    await imageRef.set(imageData);
    return { id: imageRef.id, ...imageData };
};
