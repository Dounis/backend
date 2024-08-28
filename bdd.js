import admin from 'firebase-admin';
import serviceAccount from './predictiondbKey.json' assert { type: 'json' };

// Initialiser Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createEmptyDataStructure() {
    // Créer un document 'Utilisateurs' avec un utilisateur vide
    const utilisateursRef = db.collection('Utilisateurs').doc(); // ID généré automatiquement
    await utilisateursRef.set({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        fonction: ''
    });
    console.log(`Utilisateur vide créé avec ID: ${utilisateursRef.id}`);

    // Créer un document 'Questions' avec une question vide
    const questionsRef = db.collection('Questions').doc(); // ID généré automatiquement
    await questionsRef.set({
        titre: '',
        description: '',
        utilisateurId: '',
        imageId: '',
        datePublication: new Date()
    });
    console.log(`Question vide créée avec ID: ${questionsRef.id}`);

    // Créer une sous-collection 'Reponses' dans la question
    const reponsesRef = questionsRef.collection('Reponses').doc(); // ID généré automatiquement
    await reponsesRef.set({
        texte: '',
        utilisateurId: '',
        imageId: '',
        datePublication: new Date()
    });
    console.log(`Réponse vide créée dans la question ID: ${questionsRef.id} avec Réponse ID: ${reponsesRef.id}`);

    // Créer un document 'Images' avec une image vide
    const imagesRef = db.collection('Images').doc(); // ID généré automatiquement
    await imagesRef.set({
        chemin: '',
        utilisateurId: '',
        datePrise: new Date()
    });
    console.log(`Image vide créée avec ID: ${imagesRef.id}`);

    // Créer un document 'Notifications' avec une notification vide
    const notificationsRef = db.collection('Notifications').doc(); // ID généré automatiquement
    await notificationsRef.set({
        utilisateurId: '',
        message: '',
        dateEnvoi: new Date(),
        type: '',
        questionId: '',
        reponseId: ''
    });
    console.log(`Notification vide créée avec ID: ${notificationsRef.id}`);

    // Créer un document 'Predictions' avec une prédiction vide
    const predictionsRef = db.collection('Prediction').doc(); // ID généré automatiquement
    await predictionsRef.set({
        imageId: '',
        typeCarence: '',
        dateAnalyse: new Date(),
        utilisateurId: ''
    });
    console.log(`Prédiction vide créée avec ID: ${predictionsRef.id}`);
}

// Exécuter la fonction pour créer la structure
createEmptyDataStructure()
    .then(() => {
        console.log('Structure de données vide créée avec succès.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Erreur lors de la création de la structure de données vide:', error);
        process.exit(1);
    });
