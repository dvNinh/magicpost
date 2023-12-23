const transactionModel = require('../models/transaction.model');

class TransactionController {
    async getTransaction(req, res, next) {
        const param = {};
        if (req.session.user.role === leader) {
            if (req.query.id && !/^GD\d{4}$/.test(req.query.id)) {
                res.status(200).json([]);
                return;
            } else {
                param.TransactionAreaID = req.query.id;
            }
        } else {
            param.TransactionAreaID = req.session.user.transaction;
        }
        req.query.name ? param.TransactionAreaNAME = req.query.name : null;
        req.query.city ? param.CityName = req.query.city : null;
        req.query.district ? param.DistrictName = req.query.district : null;
        req.query.address ? param.Address = req.query.address : null;
        req.query.coordinatesX ? param.CoordinateX = req.query.coordinatesX : null;
        req.query.coordinatesY ? param.CoordinateY = req.query.coordinatesY : null;
        req.query.leadId ? param.Manager = req.query.leadId : null;
        const page = req.query.page ? req.query.page : 1;
        const transactions = await transactionModel.getTransaction(param, page);
        let transactionList = [];
        for (let transaction of transactions) {
            if (/^GD\d{4}$/.test(transaction.TransactionAreaID)) {
                transactionList.push({
                    id: transaction.TransactionAreaID,
                    name: transaction.TransactionAreaNAME,
                    city: transaction.CityName,
                    district: transaction.DistrictName,
                    address: transaction.Address,
                    coordinatesX: transaction.CoordinateX,
                    coordinatesY: transaction.CoordinateY,
                    leadId: transaction.Manager,
                });
            }
        }
        res.status(200).json(transactionList);
    }

    async createTransaction(req, res, next) {
        let lastTransactionId = await transactionModel.getLastTransactionId();
        if (lastTransactionId === 'GD9999') {
            res.status(201).json({ message: 'da tao toi da diem gd' });
            return;
        }
        let newTransactionId = 'GD' + String(parseInt(lastTransactionId.substring(2)) + 1).padStart(4, '0');
        const param = {};
        param.TransactionAreaID = newTransactionId;
        req.body.name ? param.TransactionAreaNAME = req.body.name : null;
        req.body.city ? param.CityID = req.body.city : null;
        req.body.district ? param.DistrictID = req.body.district : null;
        req.body.address ? param.Address = req.body.address : null;
        req.body.coordinatesX ? param.CoordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? param.CoordinateY = req.body.coordinatesY : null;
        req.body.leadId ? param.Manager = req.body.leadId : null;
        await transactionModel.createTransaction(param);
        res.status(201).json({ message: 'Success' });
    }

    async updateTransaction(req, res, next) {
        const update = {};
        req.body.name ? update.TransactionAreaNAME = req.body.name : null;
        req.body.city ? update.CityID = req.body.city : null;
        req.body.district ? update.DistrictID = req.body.district : null;
        req.body.address ? update.Address = req.body.address : null;
        req.body.coordinatesX ? update.CoordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? update.CoordinateY = req.body.coordinatesY : null;
        req.body.leadId ? update.Manager = req.body.leadId : null;
        const condition = {};
        req.query.id ? condition.TransactionAreaID = req.query.id : null;
        req.query.name ? condition.TransactionAreaNAME = req.query.name : null;
        req.query.city ? condition.CityName = req.query.city : null;
        req.query.district ? condition.DistrictName = req.query.district : null;
        req.query.address ? condition.Address = req.query.address : null;
        req.query.coordinatesX ? condition.CoordinateX = req.query.coordinatesX : null;
        req.query.coordinatesY ? condition.CoordinateY = req.query.coordinatesY : null;
        req.query.leadId ? condition.Manager = req.query.leadId : null;
        await transactionModel.updateTransaction(update, condition);
        res.status(201).json({ message: 'Success' });
    }

    async deleteTransaction(req, res, next) {
        if (!req.query.id) {
            res.status(400).json({ message: 'unknown delete' });
            return;
        }
        await transactionModel.deleteTransaction(req.query.id);
        res.status(200).json({ message: 'Success' });
    }
}

module.exports = new TransactionController;
