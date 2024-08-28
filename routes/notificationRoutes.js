// notificationRoutes.js

import express from 'express';
import { consulterNotifications, marquerNotificationCommeLue } from '../controllers/notificationController.js';

const router = express.Router();

// Route pour récupérer les notifications par utilisateur ID
router.get('/:userId', consulterNotifications);

// Route pour marquer une notification comme lue
router.patch('/:notificationId/marquer-comme-lue', marquerNotificationCommeLue);

export default router;
