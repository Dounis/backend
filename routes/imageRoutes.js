import express from 'express';
//import { enregistrerImage, telechargerImage } from '../controllers/imageController.js';
import { enregistrerImage, telechargerImage } from '../controllers/imageController.js';
//import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//router.post('/upload', protect, telechargerImage, enregistrerImage);
// Routes pour les images
router.post('/images', telechargerImage, enregistrerImage);

export default router;
