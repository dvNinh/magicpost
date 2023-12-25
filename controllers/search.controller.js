const transactionModel = require('../models/transaction.model');
const cityModel = require('../models/city.model');
const districtModel = require('../models/district.model');

class SearchController {
    async searchTransaction(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
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
            });
        }
        res.status(200).json(transactionList);
    }

    async searchGathering(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
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

        const gatherings = await transactionModel.searchTransaction(searchValue, param, page, limit, sortOrder);
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
                transactionId: gathering.transactionId
            });
        }
        res.status(200).json(gatheringList);
    }
}

module.exports = new SearchController;