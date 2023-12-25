var pool = require('../config/db');

class OrderStatusModel {
    async getOrderStatusById(id) {
        var sql = 
            'SELECT * ' +
            'FROM ORDER_STATUS ' +
            'WHERE order_id = ?';
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    async getOrderStatus(param, page) {
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
            'FROM ORDER_STATUS ' +
            `${where}` +
            `ORDER BY order_id ASC LIMIT ?, 10`;
        const [rows] = await pool.query(sql, [ ...Object.values(param), (page - 1) * 10 ]);
        return rows;
    }

    async createOrderStatus(param) {
        var sql = 'INSERT INTO ORDER_STATUS SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateOrderStatus(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE ORDER_STATUS SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }
}

module.exports = new OrderStatusModel;
