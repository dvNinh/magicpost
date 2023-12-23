class AuthController {
    isLogged(req, res, next) {
        if (!req.session.user) res.status(401).json({ message: 'unlogged' });
        else next();
    }

    isLeader(req, res, next) {
        if (!req.session.user) res.status(401).json({ message: 'unlogged' });
        else if (req.session.user.role !== 'leader') res.status(403).json({ message: 'access is not allowed' });
        else next();
    }

    isManager(req, res, next) {
        if (!req.session.user) res.status(401).json({ message: 'unlogged' });
        else if (req.session.user.role === 'leader') next();
        else if (req.session.user.role === 'dean_tran') next();
        else if (req.session.user.role === 'dean_gather') next();
        else res.status(403).json({ message: 'access is not allowed' });
    }

    isTransactionManager(req, res, next) {
        if (!req.session.user) res.status(401).json({ message: 'unlogged' });
        else if (req.session.user.role === 'leader') next();
        else if (req.session.user.role === 'dean_tran') next();
        else res.status(403).json({ message: 'access is not allowed' });
    }

    isGatheringManager(req, res, next) {
        if (!req.session.user) res.status(401).json({ message: 'unlogged' });
        else if (req.session.user.role === 'leader') next();
        else if (req.session.user.role === 'dean_gather') next();
        else res.status(403).json({ message: 'access is not allowed' });
    }
}

module.exports = new AuthController;