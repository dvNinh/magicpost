const CityModel = require('../models/city.model');

class CityController {
    async getCity(req, res, next) {
        const citys = await CityModel.getCity();
        res.status(200).json(citys);
    }

    async getCityById(req, res, next) {
        const city = await CityModel.getCityById(req.params.id);
        res.status(200).json(city);
    }
}

module.exports = new CityController;