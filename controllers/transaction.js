const transactionModel = require('../models/transaction');

const pool = require('../config/db');

class TransactionController {
    async getTransaction(req, res, next) {
        if (req.query.id) {
            if (!/^GD\d{4}$/.test(req.query.id)) {
                res.status(200).json([]);
            } else {
                const transaction = await transactionModel.getTransactionById(req.query.id);
                res.status(200).json(transaction);
            }
        } else {
            const param = {};
            req.query.name ? param.TransactionAreaNAME = req.query.name : null;
            req.query.city ? param.CityName = req.query.city : null;
            req.query.district ? param.DistrictName = req.query.district : null;
            req.query.address ? param.Address = req.query.address : null;
            req.query.coordinates ? param.CoordinateX = req.query.coordinates : null;
            req.query.coordinates ? param.CoordinateY = req.query.coordinates : null;
            req.query.leadId ? param.TransactionAreaMANAGERID = req.query.leadId : null;
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
                        coordinates: `${transaction.CoordinateX} ${transaction.CoordinateY}`,
                        leadId: transaction.TransactionAreaMANAGERID,
                    });
                }
            }
            res.status(200).json(transactionList);
        }
    }

    async createTransaction(req, res, next) {
        let sql =
            'SELECT TransactionAreaID ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE TransactionAreaID LIKE "GD____" ' +
            'ORDER BY TransactionAreaID DESC LIMIT 1';
        const lastTransaction = await pool.query(sql);
        let lastTransactionId = lastTransaction[0][0] ? lastTransaction[0][0]['TransactionAreaID'] : `GD0000`;
        if (lastTransactionId === 'GD9999') {
            res.status(201).json({ message: 'da tao toi da diem gd' });
        } else {
            let newTransactionId = 'GD' + String(parseInt(lastTransactionId.substring(2)) + 1).padStart(4, '0');
            const param = {};
            param.TransactionAreaID = newTransactionId;
            req.body.name ? param.TransactionAreaNAME = req.body.name : null;
            req.body.city ? param.CityID = req.body.city : null;
            req.body.district ? param.DistrictID = req.body.district : null;
            req.body.address ? param.Address = req.body.address : null;
            req.body.coordinates ? param.CoordinateX = req.body.coordinates : null;
            req.body.coordinates ? param.CoordinateY = req.body.coordinates : null;
            req.body.leadId ? param.TransactionAreaMANAGERID = req.body.leadId : null;
            await transactionModel.createTransaction(param);
            res.status(201).json({ message: 'Success' });
        }
    }

    async updateTransaction(req, res, next) {
        const update = {};
        req.body.name ? update.TransactionAreaNAME = req.body.name : null;
        req.body.city ? update.CityID = req.body.city : null;
        req.body.district ? update.DistrictID = req.body.district : null;
        req.body.address ? update.Address = req.body.address : null;
        req.body.coordinates ? update.CoordinateX = req.body.coordinates : null;
        req.body.coordinates ? update.CoordinateY = req.body.coordinates : null;
        req.body.leadId ? update.TransactionAreaMANAGERID = req.body.leadId : null;
        const condition = {};
        req.query.id ? condition.TransactionAreaID = req.query.id : null;
        req.query.name ? condition.TransactionAreaNAME = req.query.name : null;
        req.query.city ? condition.CityName = req.query.city : null;
        req.query.district ? condition.DistrictName = req.query.district : null;
        req.query.address ? condition.Address = req.query.address : null;
        req.query.coordinates ? condition.CoordinateX = req.query.coordinates : null;
        req.query.coordinates ? condition.CoordinateY = req.query.coordinates : null;
        req.query.leadId ? condition.TransactionAreaMANAGERID = req.query.leadId : null;
        await transactionModel.updateTransaction(update, condition);
        res.status(201).json({ message: 'Success' });
    }

    async deleteTransaction(req, res, next) {
        await transactionModel.deleteTransaction(req.query.id);
        res.status(200).json({ message: 'Success' });
    }
}

module.exports = new TransactionController;
