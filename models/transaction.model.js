const pool = require('../config/db');

const CityModel = require('./city.model');
const DistrictModel = require('./district.model');

class TransactionModel {
    async getTransactionById(id) {
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA' +
            'WHERE TransactionAreaID = ?';
        const [rows] = await pool.query(sql, [id]);
        const city = await CityModel.getCityById(rows[0].CityID);
        const district = await DistrictModel.getDistrictById(rows[0].DistrictID);
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
        return rows[0].TransactionAreaID;
    }

    async getTransaction(param, page) {
        let where = '';
        if (Object.keys(param).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(param)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -4);
        }
        var sql = 
            'SELECT * ' +
            'FROM TRANSACTION_AREA ' +
            `${where}` +
            `ORDER BY TransactionAreaID ASC LIMIT ${(page - 1) * 10}, 10`;
        const [rows] = await pool.query(sql, Object.values(param));
        let transactions = [];
        for (let row of rows) {
            const city = await CityModel.getCityById(row.CityID);
            const district = await DistrictModel.getDistrictById(row.DistrictID);
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
