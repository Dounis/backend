import jwt from 'jsonwebtoken';
import { jwtSecret } from '../firebase.js';

export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log('Received Token for Verification:', token); // Ajoutez ce log pour vérifier le token

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé, token requis' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log('Decoded token:', decoded); // Log le token décodé pour vérifier les informations
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message); // Ajoutez ce log pour les erreurs de vérification
        return res.status(401).json({ message: 'Token invalide' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.fonction === 'Administrateur') {
        next();
    } else {
        return res.status(401).json({ message: 'Accès refusé. Cette route est réservée aux administrateurs' });
    }
};
