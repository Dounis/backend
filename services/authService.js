import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, jwtSecret } from '../firebase.js';

const authentifier = async (email, motDePasse) => {
    console.log("Received email:", email);
    console.log("Received password:", motDePasse);

    const userRef = db.collection('Utilisateurs');
    const snapshot = await userRef.where('email', '==', email).get();

    if (snapshot.empty) {
        throw new Error('Utilisateur non trouvé');
    }

    const utilisateur = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id; // Obtenez l'ID de l'utilisateur

    console.log("Stored hash:", utilisateur.motDePasse);

    if (!motDePasse || !utilisateur.motDePasse) {
        throw new Error('Données de mot de passe manquantes ou incorrectes');
    }

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch) {
        throw new Error('Mot de passe incorrect.');
    }

    const token = jwt.sign(
        { id: userId, email: utilisateur.email, fonction: utilisateur.fonction },
        jwtSecret,
        { expiresIn: '24h' }
    );

    return { userId, token }; // Retourne l'ID utilisateur et le token
};

export default authentifier;
