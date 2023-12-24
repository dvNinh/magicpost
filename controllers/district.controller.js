const DistrictModel = require('../models/district.model');

class DistrictController {
    async getDistrict(req, res, next) {
        const districts = await DistrictModel.getDistrict();
        res.status(200).json(districts);
    }

    async getDistrictById(req, res, next) {
        const district = await DistrictModel.getDistrictById(req.params.id);
        res.status(200).json(district);
    }

    async getDistrictByCityId(req, res, next) {
        const districts = await DistrictModel.getDistrictByCityId(req.params.id);
        res.status(200).json(districts);
    }
}

module.exports = new DistrictController;