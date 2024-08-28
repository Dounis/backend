import multer from 'multer';
import path from 'path';
import { enregistrerImage as serviceEnregistrerImage } from '../services/imageService.js';

// Configuration de multer pour enregistrer les images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Middleware de Multer pour la gestion des fichiers entrants
export const telechargerImage = multer({ storage: storage }).single('image');

// Enregister les détails de l'image après le téléchargement
export const enregistrerImage = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Aucun fichier fourni');
        }

        const utilisateurId = req.user.id;
        const chemin = req.file.path;
        const datePrise = new Date();

        const image = await serviceEnregistrerImage({
            utilisateurId, 
            chemin,
            datePrise
        });

        res.status(201).json({ message: 'Image téléchargée avec succès', image });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image: ' + error.message });
    }
};
