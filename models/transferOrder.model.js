var pool = require('../config/db');

class TransferOrderModel {
    async getTransferOrderById(id) {
        var sql = 
            'SELECT * ' +
            'FROM TRANSFER_ORDER ' +
            'WHERE order_id = ?';
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    async getTransferOrder(param, page) {
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
            'FROM TRANSFER_ORDER ' +
            `${where}` +
            `ORDER BY order_id ASC LIMIT ?, 10`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * 10 ]);
        return rows;
    }

    async createTransferOrder(param) {
        var sql = 'INSERT INTO TRANSFER_ORDER SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateTransferOrder(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE TRANSFER_ORDER SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }

    async deleteTransferOrder(id) {
        var sql = 'DELETE FROM TRANSFER_ORDER WHERE order_id = ?';
        const [results] = await pool.query(sql, [id]);
        return results;
    }
}

module.exports = new TransferOrderModel;
