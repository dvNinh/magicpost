const transactionModel = require('../models/transaction');

const db = require('../config/db');

class TransactionController {
    async getTransaction(req, res, next) {
        if (req.query.id && !/^GD\d{4}$/.test(req.query.id)) {
            res.status(200).json([]);
            return;
        }
        const param = {
            TransactionAreaID: req.query.id,
	        TransactionAreaNAME: req.query.name,
	        CityName: req.query.city,
	        DistrictName: req.query.district,
	        Address: req.query.address,
	        CoordinateX: req.query.coordinates,
	        CoordinateY: req.query.coordinates,
	        TransactionAreaMANAGERID: req.query.leadId,
        };
        const page = req.query.page ? req.query.page : 1;
        const transactions = await transactionModel.getTransaction(param, page);
        var transactionList = [];
        for (var transaction of transactions) {
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

    async createTransaction(req, res, next) {
        var sql =
            'SELECT TransactionAreaID ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE TransactionAreaID LIKE "GD____" ' +
            'ORDER BY TransactionAreaID DESC LIMIT 1';
        const lastTransactionId = await new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                return resolve(results[0].TransactionAreaID);
            });
        });
        if (lastTransactionId === 'GD9999') {
            res.status(201).json({ message: 'da tao toi da diem gd' });
            return;
        }
        let newTransactionId = 'GD' + String(parseInt(lastTransactionId.substring(2)) + 1).padStart(4, '0');
        const param = {
            TransactionAreaID: newTransactionId,
	        TransactionAreaNAME: req.body.name,
	        CityID: req.body.city,
	        DistrictID: req.body.district,
	        Address: req.body.address,
	        CoordinateX: req.body.coordinates,
	        CoordinateY: req.body.coordinates,
	        TransactionAreaMANAGERID: req.body.leadId,
        };
        try {
            await transactionModel.createTransaction(param);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_DUP_ENTRY') {
                res.status(401).json({ message: 'id da ton tai' });
            }
        }
    }

    async updateTransaction(req, res, next) {
        const update = {
            TransactionAreaID: req.body.id,
	        TransactionAreaNAME: req.body.name,
	        CityID: req.body.city,
	        DistrictID: req.body.district,
	        Address: req.body.address,
	        CoordinateX: req.body.coordinates,
	        CoordinateY: req.body.coordinates,
	        TransactionAreaMANAGERID: req.body.leadId,
        };
        const condition = {
            TransactionAreaID: req.query.id,
	        TransactionAreaNAME: req.query.name,
	        CityID: req.query.city,
	        DistrictID: req.query.district,
	        Address: req.query.address,
	        CoordinateX: req.query.coordinates,
	        CoordinateY: req.query.coordinates,
	        TransactionAreaMANAGERID: req.query.leadId,
        };
        try {
            await transactionModel.updateTransaction(update, condition);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_PARSE_ERROR') {
                res.status(401).json({ message: 'khong co thong tin cap nhat' });
            }
        }
    }

    async deleteTransaction(req, res, next) {
        const param = {
            TransactionAreaID: req.query.id,
	        TransactionAreaNAME: req.query.name,
	        CityID: req.query.city,
	        DistrictID: req.query.district,
	        Address: req.query.address,
	        CoordinateX: req.query.coordinates,
	        CoordinateY: req.query.coordinates,
	        TransactionAreaMANAGERID: req.query.leadId,
        };
        try {
            await transactionModel.deleteTransaction(param);
            res.status(200).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new TransactionController;
