const accountModel = require('../models/account.model');

class AccountController {
    async getAccount(req, res, next) {
        const param = {};
        req.query.username ? param.username = req.query.username : null;
        req.query.password ? param.password = req.query.password : null;
        req.query.fullName ? param.full_name = req.query.fullName : null;
        req.query.role ? param.role = req.query.role : null;
        if (req.session.user.role === 'leader') req.query.transaction ? param.transaction = req.query.transaction : null;
        else param.transaction = req.session.user.transaction;
        const page = req.query.page ? req.query.page : 1;
        const accounts = await accountModel.getAccount(param, page);
        let accountList = [];
        for (let account of accounts) {
            accountList.push({
                username: account.username,
                password: account.password,
                fullName: account.full_name,
                role: account.role,
                transaction: account.transaction,
            });
        }
        res.status(200).json(accountList);
    }

    async createAccount(req, res, next) {
        const param = {};
        req.body.username ? param.username = req.body.username : null;
        req.body.password ? param.password = req.body.password : null;
        req.body.role ? param.role = req.body.role : null;
        if (req.session.user.role === 'leader') req.body.transaction ? param.transaction = req.body.transaction : null;
        else param.transaction = req.session.user.transaction;
        await accountModel.createAccount(param);
        res.status(201).json({ message: 'create account success' });
    }

    async updateAccount(req, res, next) {
        const update = {};
        req.body.password ? update.password = req.body.password : null;
        if (req.session.user.role === 'leader') {
            req.body.role ? update.role = req.body.role : null
            req.body.transaction ? update.transaction = req.body.transaction : null;
        }
        const condition = {};
        if (req.session.user.role === 'transacting' || req.session.user.role === 'gathering') {
            condition.username = req.session.user.username;
        } else {
            req.query.username ? condition.username = req.query.username : null;
            if (req.session.user.role !== 'leader') condition.transaction = req.session.user.transaction;
        }
        await accountModel.updateAccount(update, condition);
        res.status(201).json({ message: 'update account success' });
    }

    async deleteAccount(req, res, next) {
        const param = {};
        if (req.session.user.role !== 'leader') param.transaction = req.session.user.transaction;
        else req.query.transaction ? param.transaction = req.query.transaction : null;
        req.query.username ? param.username = req.query.username : null;
        req.query.password ? param.password = req.query.password : null;
        req.query.role ? param.role = req.query.role : null;
        await accountModel.deleteAccount(param);
        res.status(200).json({ message: 'delete account success' });
    }
}

module.exports = new AccountController;
