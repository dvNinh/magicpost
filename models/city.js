const schema = require('./schema')

const { selectQuery } = require('../utils/query');

class CityModel {  
    getCity(param) {
        var sql = selectQuery('CITY', param);
        return schema.get(sql);
    }
}

module.exports = new CityModel;
