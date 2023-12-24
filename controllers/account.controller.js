const bcrypt = require('bcrypt');
const saltRounds = 10;

const accountModel = require('../models/account.model');

const validate = require('../utils/validate');

class AccountController {
    async getAccount(req, res, next) {
        const param = {};
        req.query.username ? param.username = req.query.username : null;
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
                fullName: account.full_name,
                role: account.role,
                transaction: account.transaction,
            });
        }
        res.status(200).json(accountList);
    }

    async createAccount(req, res, next) {
        const param = {};

        if (!req.body.username) {
            res.status(400).json({ message: 'username is required' });
            return;
        } else if (!validate.validateUsername(req.body.username)){
            res.status(400).json({ message: 'username is invalid' });
            return;
        } else {
            const account = await accountModel.getAccountByUsername(req.body.username);
            if (account) {
                res.status(405).json({ message: 'username already exists' });
                return;
            }
            param.username = req.body.username;
        }

        if (!req.body.password) {
            res.status(400).json({ message: 'password is required' });
            return;
        } else if (!validate.validatePassword(req.body.password)){
            res.status(400).json({ message: 'password is invalid' });
            return;
        } else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.password, salt);
            param.password = hash;
        }

        if (req.session.user.role === 'leader') {
            req.body.transaction ? param.transaction = req.body.transaction : null;
            req.body.role ? param.role = req.body.role : null;
        } else {
            param.transaction = req.session.user.transaction;
            req.session.user.role = 'dean_tran' ? param.role = 'transacting' : param.role = 'gathering';
        }

        await accountModel.createAccount(param);
        res.status(201).json({ message: 'create account success' });
    }

    async updateAccount(req, res, next) {
        const update = {};

        if (req.body.password) {
            if (!validate.validatePassword(req.body.password)){
                res.status(400).json({ message: 'password is invalid' });
                return;
            } else {
                update.password = req.body.password;
            }
        }

        if (req.session.user.role === 'leader') {
            req.body.role ? update.role = req.body.role : null
            req.body.transaction ? update.transaction = req.body.transaction : null;
        }

        if (Object.keys(update).length == 0) {
            res.status(400).json({ message: 'unknown update' });
            return;
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
