const bcrypt = require('bcrypt');

const accountModel = require('../models/account.model');

const validate = require('../utils/validate');

class LoginController {
    async login(req, res, next) {
        if (!req.body.username) {
            res.status(401).json({ message: 'username is undefined' });
            return;
        } else if (!validate.validateUsername(req.body.username)){
            res.status(400).json({ message: 'username is invalid' });
            return;
        }
        if (!req.body.password) {
            res.status(401).json({ message: 'password is undefined' });
            return;
        } else if (!validate.validatePassword(req.body.password)){
            res.status(400).json({ message: 'password is invalid' });
            return;
        }
        const account = await accountModel.getAccountByUsername(req.body.username);
        if (!account) {
            res.status(401).json({ message: 'username is incorrect' });
            return;
        }
        const compare = bcrypt.compareSync(req.body.password, account.password);
        if (compare == false) {
            res.status(403).json({ message: 'password is incorrect' });
            return;
        }
        req.session.regenerate(err => {
            if (err) return err;
            req.session.user = account;
            req.session.save(err => {
                if (err) return err;
                res.status(200).json({
                    message: 'Login successful',
                    role: account.role
                });
            });
        });
    }

    getRole(req, res, next) {
        res.status(200).json({
            username: req.session.user.username,
            fullName: req.session.user.fullName,
            role: req.session.user.role
        });
    }

    logout(req, res, next) {
        req.session.destroy();
        res.status(200).json({
            message: 'Success',
        });
    }
}

module.exports = new LoginController;
