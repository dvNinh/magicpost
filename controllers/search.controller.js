const transactionModel = require('../models/transaction.model');
const gatheringModel = require('../models/gathering.model');
const cityModel = require('../models/city.model');
const districtModel = require('../models/district.model');
const orderStatusModel = require('../models/orderStatus.model');
const orderStatusController = require('./orderStatus.controller');

class SearchController {
    async searchTransaction(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = !!parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = !!parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'ascending';

        const param = {};
        
        if (req.query.city) {
            const city = await cityModel.getCityById(req.query.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }

        if (req.query.district) {
            const district = await districtModel.getDistrictById(req.query.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }

        const transactions = await transactionModel.searchTransaction(searchValue, param, page, limit, sortOrder);
        let transactionList = [];
        for (let transaction of transactions) {
            let tran = {
                id: transaction.TransactionAreaID,
                name: transaction.TransactionAreaNAME,
                city: transaction.CityName,
                district: transaction.DistrictName,
                cityId: transaction.CityID,
                districtId: transaction.DistrictID,
                address: transaction.Address,
                coordinatesX: transaction.CoordinateX,
                coordinatesY: transaction.CoordinateY,
                gatheringId: transaction.gatheringId
            };
            if (req.session.user.role == 'leader') {
                tran.manager = transaction.Manager;
            }
            transactionList.push(tran);
        }
        res.status(200).json(transactionList);
    }

    async searchGathering(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = !!parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = !!parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'ascending';
        
        const param = {};
        
        if (req.query.city) {
            const city = await cityModel.getCityById(req.query.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }

        if (req.query.district) {
            const district = await districtModel.getDistrictById(req.query.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }

        const gatherings = await gatheringModel.searchGathering(searchValue, param, page, limit, sortOrder);
        let gatheringList = [];
        for (let gathering of gatherings) {
            let gather = {
                id: gathering.id,
                name: gathering.name,
                city: gathering.CityName,
                district: gathering.DistrictName,
                cityId: gathering.CityID,
                districtId: gathering.DistrictID,
                address: gathering.address,
                coordinatesX: gathering.coordinateX,
                coordinatesY: gathering.coordinateY,
            };
            if (req.session.user.role == 'leader') {
                gather.manager = gathering.manager;
            }
            gatheringList.push(gather);
        }
        res.status(200).json(gatheringList);
    }

    async searchOrder(req, res, next) {
        if (!req.query.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.query.id;

        const order = await orderStatusModel.getOrderStatusById(id);
        if (!order) {
            res.status(404).json({ message: 'order not found' });
            return;
        }
        const orderStatus = await orderStatusModel.getOrderStatusById(id);
        res.status(200).json({
            order,
            status: orderStatusController.getOrderStatus(orderStatus)
        });
    }
}

module.exports = new SearchController;