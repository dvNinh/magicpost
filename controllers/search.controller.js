const transactionModel = require('../models/transaction.model');
const gatheringModel = require('../models/gathering.model');
const cityModel = require('../models/city.model');
const districtModel = require('../models/district.model');
const orderStatusModel = require('../models/orderStatus.model');

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
            transactionList.push({
                id: transaction.TransactionAreaID,
                name: transaction.TransactionAreaNAME,
                city: transaction.CityName,
                district: transaction.DistrictName,
                cityId: transaction.CityID,
                districtId: transaction.DistrictID,
                address: transaction.Address,
                coordinatesX: transaction.CoordinateX,
                coordinatesY: transaction.CoordinateY,
                manager: transaction.Manager,
                gatheringId: transaction.gatheringId
            });
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
            gatheringList.push({
                id: gathering.id,
                name: gathering.name,
                city: gathering.CityName,
                district: gathering.DistrictName,
                cityId: gathering.CityID,
                districtId: gathering.DistrictID,
                address: gathering.address,
                coordinatesX: gathering.coordinateX,
                coordinatesY: gathering.coordinateY,
                manager: gathering.manager,
            });
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
        res.status(200).json({
            id: order.order_id,
            timeSendTrans1: order.time_send_trans1,
	        timeSendGather1: order.time_send_gather1,
	        timeSendGather2: order.time_send_gather2,
	        timeSendTrans2: order.time_send_trans2,
	        timeShip: order.time_ship,
	        timeReceive: order.time_receive,
	        timeReturnTrans1: order.time_return_trans1,
	        timeReturnGather1: order.time_return_gather1,
	        timeReturnGather2: order.time_return_gather2,
	        timeReturnTrans2: order.time_return_trans2,
	        timeShipBack: order.time_ship_back,
	        timeReceiveBack: order.time_receive_back,
	        timeDestroy: order.time_destroy,
	        currentStatus: order.current_status,
	        currentPosition: order.current_position
        });
    }
}

module.exports = new SearchController;