const transactionModel = require('../models/transaction.model');
const CityModel = require('../models/city.model');
const DistrictModel = require('../models/district.model');

class GatheringController {
    async getGathering(req, res, next) {
        const param = {};
        if (req.session.user.role === 'leader') {
            if (req.query.id && !/^TK\d{4}$/.test(req.query.id)) {
                res.status(200).json([]);
                return;
            } else {
                req.query.id ? param.TransactionAreaID = req.query.id : null;
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
        const transactions = await transactionModel.getGathering(param, page);
        let transactionList = [];
        for (let transaction of transactions) {
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
        res.status(200).json(transactionList);
    }

    async createGathering(req, res, next) {
        let lastGatheringId = await transactionModel.getLastGatheringId();
        if (lastGatheringId === 'TK9999') {
            res.status(201).json({ message: 'da tao toi da diem tk' });
            return;
        }
        let newGatheringId = 'TK' + String(parseInt(lastGatheringId.substring(2)) + 1).padStart(4, '0');
        const param = {};
        param.TransactionAreaID = newGatheringId;
        req.body.name ? param.TransactionAreaNAME = req.body.name : null;
        if (req.body.city) {
            const city = await CityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }
        if (req.body.district) {
            const district = await DistrictModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }
        req.body.address ? param.Address = req.body.address : null;
        req.body.coordinatesX ? param.CoordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? param.CoordinateY = req.body.coordinatesY : null;
        if (req.body.manager) {
            const manager = await accountModel.getAccountByUsername(req.body.manager);
            if (!manager || manager.role != 'dean_gather') {
                res.status(400).json({ message: 'manager unknown' });
                return;
            }
            if (manager.transaction) {
                await transactionModel.updateTransaction(
                    { manager: null },
                    { TransactionAreaID: manager.transaction }
                );
            }
            param.Manager = manager.username
            await accountModel.updateAccount(
                { transaction: newTransactionId },
                { username: manager.username }
            );
        }

        await transactionModel.createTransaction(param);
        res.status(201).json({ message: 'Success' });
    }

    async updateGathering(req, res, next) {
        const update = {};

        req.body.name ? update.TransactionAreaNAME = req.body.name : null;
        if (req.body.city) {
            const city = await CityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            update.CityID = city.id;
        }

        if (req.body.district) {
            const district = await DistrictModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            update.DistrictID = district.id;
        }

        req.body.address ? update.Address = req.body.address : null;
        req.body.coordinatesX ? update.CoordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? update.CoordinateY = req.body.coordinatesY : null;
        
        if (req.body.manager) {
            if (!req.query.id) {
                res.status(400).json({ message: 'gathering unknown' });
                return;
            }
            const transaction = await transactionModel.getTransactionById(req.query.id);
            if (!transaction) {
                res.status(400).json({ message: 'gathering unknown' });
                return;
            }
            const manager = await accountModel.getAccountByUsername(req.body.manager);
            if (!manager || manager.role != 'dean_gather') {
                res.status(400).json({ message: 'manager unknown' });
                return;
            }
            if (manager.transaction) {
                await transactionModel.updateTransaction(
                    { manager: null },
                    { TransactionAreaID: manager.transaction }
                );
            }
            update.Manager = manager.username
            await accountModel.updateAccount(
                { transaction: req.query.id },
                { username: manager.username }
            );
        }

        if (Object.keys(update).length == 0) {
            res.status(400).json({ message: 'unknown update' });
            return;
        }

        const condition = {};

        req.query.id ? condition.TransactionAreaID = req.query.id : null;
        req.query.name ? condition.TransactionAreaNAME = req.query.name : null;

        if (req.query.city) {
            const city = await CityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            condition.CityID = city.id;
        }

        if (req.query.district) {
            const district = await DistrictModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            condition.DistrictID = district.id;
        }

        req.query.address ? condition.Address = req.query.address : null;
        req.query.coordinatesX ? condition.CoordinateX = req.query.coordinatesX : null;
        req.query.coordinatesY ? condition.CoordinateY = req.query.coordinatesY : null;
        req.query.leadId ? condition.Manager = req.query.leadId : null;

        await transactionModel.updateTransaction(update, condition);
        res.status(201).json({ message: 'Success' });
    }

    async deleteGathering(req, res, next) {
        if (!req.query.id) {
            res.status(400).json({ message: 'unknown delete' });
            return;
        }
        await transactionModel.deleteTransaction(req.query.id);
        res.status(200).json({ message: 'Success' });
    }
}

module.exports = new GatheringController;
