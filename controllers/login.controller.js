const accountModel = require('../models/account.model');

class LoginController {
    async login(req, res, next) {
        let param = {
            username: req.body.username,
            password: req.body.password
        };
        if (!param.username) res.status(401).json({ message: 'username is undefined' });
        else if (!param.password) res.status(401).json({ message: 'password is undefined' });
        else {
            const account = await accountModel.getAccount(param, 1);
            if (!account[0]) res.status(403).json({ message: 'username or password is incorrect' });
            else {
                req.session.regenerate(err => {
                    if (err) return err;
                    req.session.user = account[0];
                    req.session.save(err => {
                        if (err) return err;
                        res.status(200).json({
                            message: 'Login successful',
                            role: account[0].role
                        });
                    });
                });
            }
        }
    }

    logout(req, res, next) {
        req.session.destroy();
    }
}

module.exports = new LoginController;
