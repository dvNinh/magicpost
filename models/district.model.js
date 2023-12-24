const dvhc = require('../utils/xmlReading');

class DistrictModel {
    async getDistrictById(id) {
        const data = await dvhc;
        if (!data.huyen[id]) return null;
        return {
            id,
            districtName: data.huyen[id]['Ten'],
            cityId: data.huyen[id]['CapTren'],
            cityName: data.huyen[id]['TenCapTren'],
        };
    }

    async getDistrictByCityId(cityId) {
        const data = await dvhc;
        let districts = [];
        for (let id in data.huyen) {
            if (data.huyen[id]['CapTren'] == cityId) {
                districts.push({
                    id,
                    districtName: data.huyen[id]['Ten'],
                    cityId: data.huyen[id]['CapTren'],
                    cityName: data.huyen[id]['TenCapTren'],
                });
            }
        }
        return districts;
    }

    async getDistrict() {
        const data = await dvhc;
        let districts = [];
        for (let id in data.huyen) {
            districts.push({
                id,
                districtName: data.huyen[id]['Ten'],
                cityId: data.huyen[id]['CapTren'],
                cityName: data.huyen[id]['TenCapTren'],
            });
        }
        return districts;
    }
}

module.exports = new DistrictModel;
