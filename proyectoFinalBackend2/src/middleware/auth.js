import passport from 'passport';

export const isAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Solo pueden acceder administradores' });
        }

        req.user = user;
        next();
    })(req, res, next);
};
