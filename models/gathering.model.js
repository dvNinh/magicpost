const pool = require('../config/db');

const cityModel = require('./city.model');
const districtModel = require('./district.model');

class GatheringModel {
    async getGatheringById(id) {
        var sql = 
            'SELECT * ' +
            'FROM GATHERING_AREA ' +
            'WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        if (!rows[0]) return null;
        const city = await cityModel.getCityById(rows[0].CityID);
        const district = await districtModel.getDistrictById(rows[0].DistrictID);
        if (!city || !district || city.id != district.cityId) return null;
        rows[0].CityName = city.name;
        rows[0].DistrictName = district.districtName;
        return rows[0];
    }

    async getGatheringByManager(username) {
        var sql = 
            'SELECT * ' +
            'FROM GATHERING_AREA ' +
            'WHERE manager = ?';
        const [rows] = await pool.query(sql, [username]);
        if (!rows[0]) return null;
        const city = await cityModel.getCityById(rows[0].CityID);
        const district = await districtModel.getDistrictById(rows[0].DistrictID);
        if (!city || !district || city.id != district.cityId) return null;
        rows[0].CityName = city.name;
        rows[0].DistrictName = district.districtName;
        return rows[0];
    }

    async getGatheringByTransaction(transaction) {
        var sql = 
            'SELECT * ' +
            'FROM GATHERING_AREA ' +
            'WHERE transaction = ?';
        const [rows] = await pool.query(sql, [transaction]);
        if (!rows[0]) return null;
        const city = await cityModel.getCityById(rows[0].CityID);
        const district = await districtModel.getDistrictById(rows[0].DistrictID);
        if (!city || !district || city.id != district.cityId) return null;
        rows[0].CityName = city.name;
        rows[0].DistrictName = district.districtName;
        return rows[0];
    }

    async getLastGatheringId() {
        let sql =
            'SELECT id ' +
            'FROM GATHERING_AREA ' +
            'WHERE id LIKE "TK____" ' +
            'ORDER BY id DESC LIMIT 1';
        const [rows] = await pool.query(sql);
        if (!rows[0]) return 'TK0000';
        return rows[0].id;
    }

    async getGathering(param, page) {
        let where = '';
        if (Object.keys(param).length > 0) {
            for (const key of Object.keys(param)) {
                where += `AND ${key} = ? `;
            }
        }
        var sql = 
            'SELECT * ' +
            'FROM GATHERING_AREA ' +
            'WHERE id LIKE "TK____" ' +
            `${where}` +
            `ORDER BY id ASC LIMIT ?, 10`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * 10 ]);
        let gatherings = [];
        for (let row of rows) {
            const city = await cityModel.getCityById(row.CityID);
            const district = await districtModel.getDistrictById(row.DistrictID);
            if (!city || !district || city.id != district.cityId) continue;
            row.CityName = city.name;
            row.DistrictName = district.districtName;
            gatherings.push(row);
        }
        return gatherings;
    }

    async searchGathering(searchValue, param, page, limit, sortOrder) {
        const sort = sortOrder == 'ascending' ? 'ASC' : 'DESC';
        let where = '';
        if (Object.keys(param).length > 0) {
            for (const key of Object.keys(param)) {
                where += `AND ${key} = ? `;
            }
        }
        var sql = 
            'SELECT * ' +
            'FROM GATHERING_AREA ' +
            `WHERE (id LIKE "%${searchValue}%" OR name LIKE "%${searchValue}%") ` +
            `${where}` +
            `ORDER BY id ${sort} LIMIT ?, ?`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * limit, limit ]);
        let gatherings = [];
        for (let row of rows) {
            const city = await cityModel.getCityById(row.CityID);
            const district = await districtModel.getDistrictById(row.DistrictID);
            if (!city || !district || city.id != district.cityId) continue;
            row.CityName = city.name;
            row.DistrictName = district.districtName;
            gatherings.push(row);
        }
        return gatherings;
    }


    async createGathering(param) {
        var sql = 'INSERT INTO GATHERING_AREA SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateGathering(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE GATHERING_AREA SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }

    async deleteGathering(id) {
        var sql = 'DELETE FROM GATHERING_AREA WHERE id = ?';
        const [results] = await pool.query(sql, [id]);
        return results;
    }
}

module.exports = new GatheringModel;
