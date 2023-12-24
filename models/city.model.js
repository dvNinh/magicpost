const dvhc = require('../utils/xmlReading');

class CityModel {
    async getCityById(id) {
        const data = await dvhc;
        if (!data.tinh[id]) return null;
        return {
            id,
            name: data.tinh[id]
        };
    }

    async getCity() {
        const data = await dvhc;
        let citys = [];
        for (let id in data.tinh) {
            citys.push({
                id,
                name: data.tinh[id],
            });
        }
        return citys;
    }
}

module.exports = new CityModel;