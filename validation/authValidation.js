const { check } = require('express-validator');

exports.loginValidation = [
    check('email').isEmail().withMessage('Doit être une adresse email valide.'),
    check('motDePasse').not().isEmpty().withMessage('Le mot de passe est obligatoire.')
];