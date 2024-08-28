import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { populateNotifications } from './populateNotifications.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historiqueRoutes from './routes/historiqueRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import reponseRoutes from './routes/reponseRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reponses', reponseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predictions', predictionRoutes);

// Exécuter populateNotifications périodiquement (par exemple, toutes les 10 minutes)
setInterval(async () => {
    console.log("Exécution de populateNotifications...");
    try {
        await populateNotifications();
    } catch (error) {
        console.error("Erreur lors de l'exécution de populateNotifications:", error);
    }
}, 10 * 60 * 1000); // Intervalle en millisecondes (10 minutes)

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;
