const { check } = require('express-validator');

exports.creerUtilisateurValidation = [
    check('nom').not().isEmpty().withMessage('Le nom est obligatoire.'),
    check('prenom').not().isEmpty().withMessage('Le prénom est obligatoire.'),
    check('email').isEmail().withMessage('Doit être une adresse email valide.'),
    check('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    check('fonction').not().isEmpty().withMessage('La fonction est obligatoire.')
];

exports.mettreAJourUtilisateurValidation = [
    check('nom').optional().not().isEmpty().withMessage('Le nom ne peut pas être vide.'),
    check('prenom').optional().not().isEmpty().withMessage('Le prénom ne peut pas être vide.'),
    check('email').optional().isEmail().withMessage('Doit être une adresse email valide.'),
    check('fonction').optional().not().isEmpty().withMessage('La fonction est obligatoire.')
];