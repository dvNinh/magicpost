var pool = require('../config/db');

class OrderModel {
    async getOrderById(id) {
        var sql = 
            'SELECT * ' +
            'FROM `ORDER` ' +
            'WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    async getOrder(param, page) {
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
            'FROM `ORDER` ' +
            `${where}` +
            `ORDER BY id ASC LIMIT ${(page - 1) * 10}, 10`;
        const [rows] = await pool.query(sql, Object.values(param));
        return rows;
    }

    async createOrder(param) {
        var sql = 'INSERT INTO `ORDER` SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateOrder(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE \`ORDER\` SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }
}

module.exports = new OrderModel;
