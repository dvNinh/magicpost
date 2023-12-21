const accountModel = require('../models/account');

class AccountController {
    async getAccount(req, res, next) {
        const param = {
            username: req.query.username,
            id: req.query.id,
            full_name:  req.query.fullname,
            role: req.query.role,
        };
        const accounts = await accountModel.getAccount(param);
        var accountList = [];
        for (var account of accounts) {
            accountList.push({
                username: account.username,
                id: account.id,
                full_name:  account.fullname,
                role: account.role,
            });
        }
        res.status(200).json(transactionList);
    }

    async createAccount(req, res, next) {
        const param = {
            username: req.body.username,
            password: req.body.password,
            full_name: req.body.fullname,
            role: req.body.role
        };
        try {
            await accountModel.createAccount(param);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_DUP_ENTRY') {
                res.status(401).json({ message: 'id da ton tai' });
            }
        }
    }

    async updateAccount(req, res, next) {
        const update = {
            username: req.body.username,
            password: req.body.password,
            full_name: req.body.fullname,
            role: req.body.role
        };
        const condition = {
            username: req.param.username,
            password: req.param.password,
            full_name: req.param.fullname,
            role: req.param.role
        };
        try {
            await accountModel.updateAccount(update, condition);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_PARSE_ERROR') {
                res.status(401).json({ message: 'khong co thong tin cap nhat' });
            }
        }
    }

    async deleteAccount(req, res, next) {
        const param = {
            username: req.param.username,
            password: req.param.password,
            full_name: req.param.fullname,
            role: req.param.role
        };
        try {
            await accountModel.deleteAccount(param);
            res.status(200).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AccountController;
