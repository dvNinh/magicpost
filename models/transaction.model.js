var pool = require('../config/db');

class TransactionModel {
    async getTransactionById(id) {
        var sql = 
            'SELECT ta.*, ct.CityName, dt.DistrictName ' +
            'FROM TRANSACTION_AREA ta ' +
            'JOIN CITY ct ON ta.CityID = ct.CityID ' +
            'JOIN DISTRICT dt ON ta.DistrictID = dt.DistrictID and ta.CityID = dt.CityID ' +
            'WHERE TransactionAreaID = ?';
        const [rows] = await pool.query(sql, [id]);
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
            'SELECT ta.*, ct.CityName, dt.DistrictName ' +
            'FROM TRANSACTION_AREA ta ' +
            'JOIN CITY ct ON ta.CityID = ct.CityID ' +
            'JOIN DISTRICT dt ON ta.DistrictID = dt.DistrictID and ta.CityID = dt.CityID ' +
            `${where}` +
            `ORDER BY ta.TransactionAreaID ASC LIMIT ${(page - 1) * 10}, 10`;
        const [rows] = await pool.query(sql, Object.values(param));
        return rows;
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
