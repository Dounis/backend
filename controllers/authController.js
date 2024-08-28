// authController.js
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../firebase.js'; // Importer jwtSecret correctement
import authentifierService from '../services/authService.js';

export const getCurrentUserId = (req, res) => {
    try {
        console.log('Request received for /current-user'); // Vérifie que la méthode est appelée

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('Token is missing in the request'); // Vérifie si le token est manquant
            return res.status(401).json({ message: 'Token manquant' });
        }

        console.log('Token received:', token); // Vérifie le token reçu

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                console.log('Token verification failed:', err.message); // Log en cas d'échec de la vérification
                return res.status(403).json({ message: 'Token invalide' });
            }

            console.log('Token verified successfully, User ID:', user.id); // Log en cas de succès
            res.status(200).json({ userId: user.id });
        });
    } catch (error) {
        console.log('Error in getCurrentUserId:', error.message); // Log pour capturer toute autre erreur
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'ID utilisateur' });
    }
};

export const authentifier = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        const result = await authentifierService(email, motDePasse);
        
        console.log("Generated Token:", result.token); // Log du token généré

        res.status(200).json({
            userId: result.userId,
            token: result.token
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};



