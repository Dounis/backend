import bcrypt from 'bcryptjs';
import { db } from './firebase.js'; // Assurez-vous que le chemin d'importation est correct

async function createAdmin() {
    const email = 'apprediction24@gmail.com';  // Remplacez par l'email de l'administrateur
    const motDePasse = 'pred2024ml';  // Remplacez par le mot de passe de l'administrateur
    const nom = 'Admin';
    const prenom = 'Super';
    const fonction = 'Administrateur';

    try {
        // Vérifiez si l'utilisateur existe déjà
        const existingUserSnapshot = await db.collection('Utilisateurs').where('email', '==', email).get();
        if (!existingUserSnapshot.empty) {
            console.log('Un utilisateur avec cet email existe déjà.');
            return;
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Créer un nouvel utilisateur avec la fonction d'administrateur
        const newUser = {
            email,
            motDePasse: hashedPassword,
            nom,
            prenom,
            fonction,  // Attribuez la fonction d'administrateur
        };

        // Enregistrer l'utilisateur dans Firestore
        const userRef = await db.collection('Utilisateurs').add(newUser);

        console.log('Compte administrateur créé avec succès. ID:', userRef.id);
    } catch (error) {
        console.error('Erreur lors de la création du compte administrateur:', error.message);
    }
}

createAdmin();
