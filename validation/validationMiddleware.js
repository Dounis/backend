const { validationResult } = require('express-validator');

// Middleware pour vérifier les résultats de la validation
exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });    
    }

    return next();
};