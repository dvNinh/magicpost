const pool = require('../config/db');

const cityModel = require('./city.model');
const districtModel = require('./district.model');

class TransactionModel {
    async getTransactionById(id) {
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE TransactionAreaID = ?';
        const [rows] = await pool.query(sql, [id]);
        if (!rows[0]) return null;
        const city = await cityModel.getCityById(rows[0].CityID);
        const district = await districtModel.getDistrictById(rows[0].DistrictID);
        if (!city || !district || city.id != district.cityId) return null;
        rows[0].CityName = city.name;
        rows[0].DistrictName = district.districtName;
        return rows[0];
    }

    async getTransactionByManager(username) {
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE Manager = ?';
        const [rows] = await pool.query(sql, [username]);
        if (!rows[0]) return null;
        const city = await cityModel.getCityById(rows[0].CityID);
        const district = await districtModel.getDistrictById(rows[0].DistrictID);
        if (!city || !district || city.id != district.cityId) return null;
        rows[0].CityName = city.name;
        rows[0].DistrictName = district.districtName;
        return rows[0];
    }

    async getLastTransactionId() {
        let sql =
            'SELECT TransactionAreaID ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE TransactionAreaID LIKE "GD____" ' +
            'ORDER BY TransactionAreaID DESC LIMIT 1';
        const [rows] = await pool.query(sql);
        if (!rows[0]) return 'GD0000';
        return rows[0].TransactionAreaID;
    }

    async getTransaction(param, page) {
        let where = '';
        if (Object.keys(param).length > 0) {
            for (const key of Object.keys(param)) {
                where += `AND ${key} = ? `;
            }
        }
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA ' +
            'WHERE TransactionAreaID LIKE "GD____" ' +
            `${where}` +
            `ORDER BY TransactionAreaID ASC LIMIT ?, 10`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * 10 ]);
        let transactions = [];
        for (let row of rows) {
            const city = await cityModel.getCityById(row.CityID);
            const district = await districtModel.getDistrictById(row.DistrictID);
            if (!city || !district || city.id != district.cityId) continue;
            row.CityName = city.name;
            row.DistrictName = district.districtName;
            transactions.push(row);
        }
        return transactions;
    }

    async searchTransaction(searchValue, param, page, limit, sortOrder) {
        const sort = sortOrder == 'ascending' ? 'ASC' : 'DESC';
        let where = '';
        if (Object.keys(param).length > 0) {
            for (const key of Object.keys(param)) {
                where += `AND ${key} = ? `;
            }
        }
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA ' +
            `WHERE (TransactionAreaID LIKE "%${searchValue}%" OR TransactionAreaNAME LIKE "%${searchValue}%") ` +
            `${where}` +
            `ORDER BY TransactionAreaID ${sort} LIMIT ?, ?`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * limit, limit ]);
        let transactions = [];
        for (let row of rows) {
            const city = await cityModel.getCityById(row.CityID);
            const district = await districtModel.getDistrictById(row.DistrictID);
            if (!city || !district || city.id != district.cityId) continue;
            row.CityName = city.name;
            row.DistrictName = district.districtName;
            transactions.push(row);
        }
        return transactions;
    }


    async createTransaction(param) {
        var sql = 'INSERT INTO TRANSACTION_AREA SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateTransaction(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE TRANSACTION_AREA SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }

    async deleteTransaction(id) {
        var sql = 'DELETE FROM TRANSACTION_AREA WHERE TransactionAreaID = ?';
        const [results] = await pool.query(sql, [id]);
        return results;
    }
}

module.exports = new TransactionModel;
