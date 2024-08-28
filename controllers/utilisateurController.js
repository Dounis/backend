import utilisateurService from '../services/utilisateurService.js';

export const creerCompte = async (req, res) => {
    try {
        const utilisateur = await utilisateurService.creerCompte(req.body);
        res.status(201).json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du compte: ' + error.message });
    }
};

export const supprimerUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        await utilisateurService.supprimerUtilisateur(id);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du compte utilisateur: ' + error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur = await utilisateurService.getUserById(id);
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(404).json({ message: 'Utilisateur non trouvé: ' + error.message });
    }
};

export const getUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur = await utilisateurService.getUserById(id);
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(404).json({ message: 'Utilisateur non trouvé: ' + error.message });
    }
};

export const getUtilisateurs = async (req, res) => {
    try {
        console.log('getUtilisateurs controller called');  // Log pour indiquer que le contrôleur a été appelé
        const utilisateurs = await utilisateurService.getUtilisateurs();
        console.log('Utilisateurs retrieved:', utilisateurs.length);  // Log le nombre d'utilisateurs récupérés
        res.status(200).json(utilisateurs);
    } catch (error) {
        console.error('Erreur dans getUtilisateurs:', error.message);  // Log en cas d'erreur
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

export const getUtilisateursAvertis = async (req, res) => {
    try {
        console.log('getUtilisateursAvertis controller called');
        const utilisateursAvertis = await utilisateurService.getUtilisateursAvertis();
        if (utilisateursAvertis.length === 0) {
            console.log('Aucun utilisateur averti trouvé.');
            return res.status(404).json({ message: 'Aucun utilisateur averti trouvé.' });
        }
        console.log('Utilisateurs avertis retrieved:', utilisateursAvertis);
        res.status(200).json(utilisateursAvertis);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs avertis:', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs avertis: ' + error.message });
    }
};
