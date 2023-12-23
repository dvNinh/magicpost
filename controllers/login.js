const accountModel = require('../models/account');

class LoginController {
    async login(req, res, next) {
        const account = await accountModel.getAccount({ 
            username: req.body.username,
            password: req.body.password
        }, 1);
        if (account[0]) {
            req.session.regenerate(err => {
                if (err) return err;
                req.session.user = account[0];
                req.session.save(err => {
                    if (err) return err;
                    res.status(200).json({
                        message: 'Success',
                        user: account[0]
                    });
                });
            });
        } else {
            res.status(401).json({ message: 'tdn hoac mk ko dung' });
        }
    }
}

module.exports = new LoginController;
