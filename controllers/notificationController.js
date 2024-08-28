// notificationController.js

import { db } from '../firebase.js';
import { findByUserId } from '../models/notificationModel.js';
import { findNotificationsByUserId, markAsReadInDB } from '../services/notificationService.js';

export const likerQuestion = async (req, res) => {
  try {
      const { id: questionId } = req.params;
      const { utilisateurId } = req.body;

      // Logique pour liker la question

      // Récupérer les informations de la question et de son auteur
      const questionDoc = await db.collection('Questions').doc(questionId).get();
      const questionData = questionDoc.data();

      if (questionData && questionData.utilisateurId !== utilisateurId) {
          // Envoyer une notification à l'auteur de la question
          await createNotification({
              utilisateurId: questionData.utilisateurId,
              message: 'Votre question a reçu un like !',
              type: 'like',
              questionId: questionId,
              dateEnvoi: new Date().toISOString(),
              vue: false,
          });
      }

      res.status(200).json({ message: 'Like mis à jour avec succès' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors du like de la question' });
  }
};

export const dislikerQuestion = async (req, res) => {
  try {
      const { id: questionId } = req.params;
      const { utilisateurId } = req.body;
      
      // Récupérer les informations de la question et de son auteur
      const questionDoc = await db.collection('Questions').doc(questionId).get();
      const questionData = questionDoc.data();

      if (questionData && questionData.utilisateurId !== utilisateurId) {
          // Envoyer une notification à l'auteur de la question
          await createNotification({
              utilisateurId: questionData.utilisateurId,
              message: 'Votre question a reçu un dislike !',
              type: 'dislike',
              questionId: questionId,
              dateEnvoi: new Date().toISOString(),
              vue: false,
          });
      }

      res.status(200).json({ message: 'Dislike mis à jour avec succès' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors du dislike de la question' });
  }
};

export const consulterNotifications = async (req, res) => {
  try {
      const utilisateurId = req.params.userId;
      console.log(`Recherche des notifications pour l'utilisateur : ${utilisateurId}`);
      
      const notifications = await findByUserId(utilisateurId);
      
      if (notifications.length === 0) {
          console.log(`Aucune notification trouvée pour l'utilisateur : ${utilisateurId}`);
          return res.status(404).json({ message: 'Notifications non trouvées' });
      }
      
      res.status(200).json(notifications);
  } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error });
  }
};
  
export const repondreQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { texte, utilisateurId, imageId } = req.body;

        const reponse = await ajouterReponse(questionId, texte, utilisateurId, imageId);

        // Récupérer la question et vérifier l'auteur
        const questionDoc = await db.collection('Questions').doc(questionId).get();
        const questionData = questionDoc.data();

        if (questionData && questionData.utilisateurId !== utilisateurId) {
            // Envoyer une notification à l'auteur de la question
            await createNotification({
                utilisateurId: questionData.utilisateurId,
                message: 'Votre question a reçu une nouvelle réponse !',
                type: 'response',
                questionId: questionId,
                reponseId: reponse.id,
                dateEnvoi: new Date().toISOString(),
                vue: false,
            });
        }

        res.status(201).json(reponse);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réponse à la question." });
    }
};

// Marquer une notification comme lue
export const marquerNotificationCommeLue = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await markAsReadInDB(notificationId);
        res.status(200).json({ message: 'Notification marked as read successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read', error });
    }
};

// Récupérer les notifications pour un utilisateur spécifique
export const getNotificationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await findNotificationsByUserId(userId);
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found' });
        }
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notifications', error });
    }
};
