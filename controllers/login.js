class LoginController {
    async login(req, res, next) {
        const param = {
            username: req.query.username,
	        password: req.query.password,
        };
        const accounts = await accountModel.getAccount(param);
        if (accounts[0]) {
            req.session.regenerate(err => {
                if (err) return err;
                req.session.user = accounts[0];
                req.session.save(err => {
                    if (err) return err;
                    res.status(200).json({
                        message: 'Success',
                        user: accounts[0]
                    });
                });
            });
        } else {
            res.status(401).json({ message: 'tdn hoac mk ko dung' });
        }
    }
}

module.exports = new LoginController;
