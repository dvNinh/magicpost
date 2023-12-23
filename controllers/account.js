const accountModel = require('../models/account');

class AccountController {
    async getAccount(req, res, next) {
        const param = {};
        req.query.username ? param.username = req.query.username : null;
        // req.query.id ? param.employees_id = req.query.id : null;
        // req.query.fullName ? param.full_name = req.query.fullName : null;
        // req.query.role ? param.role = req.query.role : null;
        const page = req.query.page ? req.query.page : 1;
        const accounts = await accountModel.getAccount(param, page);
        let accountList = [];
        for (let account of accounts) {
            accountList.push({
                username: account.username,
                // id: account.employees_id,
                // fullName: account.full_name,
                // role: account.role,
            });
        }
        res.status(200).json(accountList);
    }

    async createAccount(req, res, next) {
        const param = {};
        req.body.username ? param.username = req.body.username : null;
        req.body.password ? param.password = req.body.password : null;
        await accountModel.createAccount(param);
        res.status(201).json({ message: 'Success' });
    }

    async updateAccount(req, res, next) {
        const update = {};
        req.body.password ? update.password = req.body.password : null;
        const condition = {};
        req.query.username ? condition.username = req.query.username : null;
        await accountModel.updateAccount(update, condition);
        res.status(201).json({ message: 'Success' });
    }

    async deleteAccount(req, res, next) {
        await accountModel.deleteAccount(req.query.username);
        res.status(200).json({ message: 'Success' });
    }
}

module.exports = new AccountController;
