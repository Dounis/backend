

import * as onnxruntime from 'onnxruntime-node';
import sharp from 'sharp';
import { db } from '../firebase.js';
import { enregistrerImage } from './imageService.js';

// Configuration pour le prétraitement des images
const mean = [0.485, 0.456, 0.406];
const std = [0.229, 0.224, 0.225];

// Charger le modèle ONNX
async function loadModel() {
    const session = await onnxruntime.InferenceSession.create('./ml model/maizeSoy_npk_model.onnx');
    return session;
}

// Prétraitement de l'image
async function preprocessImage(imageBuffer) {
    try {
        const metadata = await sharp(imageBuffer).metadata();
        if (!['jpeg', 'png', 'webp'].includes(metadata.format)) {
            throw new Error('Unsupported image format');
        }

        const pngBuffer = metadata.format === 'png' ? imageBuffer : await sharp(imageBuffer).png().toBuffer();
        const { data } = await sharp(pngBuffer)
            .resize(256, 256)
            .extract({ left: 16, top: 16, width: 224, height: 224 })
            .raw()
            .toBuffer({ resolveWithObject: true });

        const imageTensor = new Float32Array(3 * 224 * 224);
        data.forEach((value, index) => {
            let channel = index % 3;
            let i = Math.floor(index / 3);
            imageTensor[channel * 224 * 224 + i] = (value / 255.0 - mean[channel]) / std[channel];
        });

        return new onnxruntime.Tensor('float32', imageTensor, [1, 3, 224, 224]);
    } catch (error) {
        console.error('Erreur lors du prétraitement de l\'image :', error);
        throw error;
    }
}

// Prédiction
async function predict(imageBuffer) {
    const model = await loadModel();
    const imageTensor = await preprocessImage(imageBuffer);
    const inputs = { [model.inputNames[0]]: imageTensor };
    const outputs = await model.run(inputs);
    const outputTensor = outputs[model.outputNames[0]];
    const predictedIndex = outputTensor.data.indexOf(Math.max(...outputTensor.data));
    return ['MH', 'MK', 'MN', 'MP', 'SH', 'SK', 'SN', 'SP'][predictedIndex];
}

// Récupération des prédictions par utilisateur
export const getPredictionsByUser = async (utilisateurId) => {
    const snapshot = await db.collection('Prediction')
                            .where('utilisateurId', '==', utilisateurId)
                            .orderBy('dateAnalyse', 'desc')
                            .get();

    const predictions = [];

    for (const doc of snapshot.docs) {
        const predictionData = doc.data();
        const imageDoc = await db.collection('Images').doc(predictionData.imageId).get();
        const imageData = imageDoc.data();

        predictions.push({
            ...predictionData,
            imageBase64: imageData?.imageBase64 || null,
        });
    }

    return predictions;
};

// Enregistrer la prédiction
export const enregistrerPrediction = async (imageId, utilisateurId, typeCarence) => {
    const imageDoc = await db.collection('Images').doc(imageId).get();
    const imageUrl = imageDoc.exists ? imageDoc.data().imageUrl : null;

    const docRef = db.collection('Prediction').doc();
    const predictionData = {
        imageId,
        typeCarence,
        dateAnalyse: new Date(),
        utilisateurId,
        ...(imageUrl && { imageUrl })
    };

    await docRef.set(predictionData);
    return { id: docRef.id, ...predictionData };
};

// Détecter les carences
export const detecterCarences = async (imageBase64, utilisateurId) => {
    try {
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const imageData = await enregistrerImage(imageBase64, utilisateurId);
        
        if (!imageData || !imageData.id) {
            throw new Error('Image could not be saved or imageId is undefined');
        }

        const predictedClass = await predict(imageBuffer);
        return await enregistrerPrediction(imageData.id, utilisateurId, predictedClass);
    } catch (error) {
        console.error('Erreur lors de la prédiction :', error);
        throw error;
    }
};

// Récupérer toutes les prédictions pour l'administrateur
export const getAllPredictions = async () => {
    console.log('Récupération de toutes les prédictions');
    const snapshot = await db.collection('Prediction').orderBy('dateAnalyse', 'desc').get();

    const predictions = [];

    for (const doc of snapshot.docs) {
        const predictionData = doc.data();
        console.log(`Traitement de la prédiction ID: ${doc.id}, imageId: ${predictionData.imageId}`);
        
        const imageDoc = await db.collection('Images').doc(predictionData.imageId).get();
        if (!imageDoc.exists) {
            console.error(`Image non trouvée pour l'ID: ${predictionData.imageId}`);
            continue;
        }
        const imageBase64 = imageDoc.data().imageBase64;
        console.log(`Image récupérée pour l'ID: ${predictionData.imageId}`);

        const utilisateurDoc = await db.collection('Utilisateurs').doc(predictionData.utilisateurId).get();
        if (!utilisateurDoc.exists) {
            console.error(`Utilisateur non trouvé pour l'ID: ${predictionData.utilisateurId}`);
            continue;
        }
        const utilisateurData = utilisateurDoc.data();
        const nomComplet = `${utilisateurData.prenom} ${utilisateurData.nom}`;
        console.log(`Utilisateur trouvé: ${nomComplet}`);

        predictions.push({
            id: doc.id,
            utilisateurNom: nomComplet,
            typeCarence: predictionData.typeCarence,
            dateAnalyse: predictionData.dateAnalyse.toDate(),
            imageBase64 // Envoyer uniquement la donnée de l'image base64
        });
    }

    console.log(`Nombre total de prédictions récupérées: ${predictions.length}`);
    return predictions;
};

export const getPredictions = async () => {
    console.log('Récupération de toutes les prédictions');
    const snapshot = await db.collection('Prediction').get();

    const predictions = [];

    for (const doc of snapshot.docs) {
        const predictionData = doc.data();
        const imageId = predictionData.imageId;
        console.log(`Traitement de la prédiction ID: ${doc.id}, imageId: ${imageId}`);

        if (!imageId) {
            console.error(`Erreur: l'ID d'image est manquant pour la prédiction ${doc.id}`);
            continue;
        }

        const imageDoc = await db.collection('Images').doc(imageId).get();

        if (!imageDoc.exists) {
            console.error(`Erreur: l'image avec l'ID ${imageId} n'a pas été trouvée.`);
            continue;
        }

        const imageData = imageDoc.data();
        const imageUrl = imageData.imageUrl || imageData.base64 || null;
        if (!imageUrl) {
            console.error(`Erreur: aucune URL ou base64 pour l'image avec l'ID ${imageId}`);
            continue;
        }
        console.log(`Image récupérée pour l'ID: ${imageId}`);

        const utilisateurDoc = await db.collection('Utilisateurs').doc(predictionData.utilisateurId).get();

        if (!utilisateurDoc.exists) {
            console.error(`Utilisateur non trouvé pour l'ID: ${predictionData.utilisateurId}`);
            continue;
        }

        const utilisateurData = utilisateurDoc.data();
        console.log(`Utilisateur trouvé: ${utilisateurData.prenom} ${utilisateurData.nom}`);

        predictions.push({
            id: doc.id,
            typeCarence: predictionData.typeCarence,
            dateAnalyse: predictionData.dateAnalyse.toDate(),
            imageUrl: imageUrl, // Utilisation de l'URL ou base64 de l'image
            utilisateurNom: `${utilisateurData.prenom} ${utilisateurData.nom}`,
        });
    }

    console.log(`Nombre total de prédictions récupérées: ${predictions.length}`);
    return predictions;
};
