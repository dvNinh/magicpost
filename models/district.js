const schema = require('./schema')

const { selectQuery } = require('../utils/query');

class DistrictModel {  
    getDistrict(param) {
        var sql = selectQuery('DISTRICT', param);
        return schema.get(sql);
    }
}

module.exports = new DistrictModel;
