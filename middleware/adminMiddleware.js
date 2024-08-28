export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role == 'Administrateur') {
        next();
    } else {
        return res.status(401).json({ message: 'Accès refusé. Cette route est réservée aux administrateurs' });
    }
};
