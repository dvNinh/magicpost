const pool = require('../config/db');

class StatisticModel {
    async getOrderStatus(from, to, transactionId) {
        let where = '';
        let values = [];
        if (from && to && transactionId) {
            where = 'WHERE od.ArriveAt >= ? AND od.ArriveAt <= ? AND od.ReceiverTransactionAreaID = ?';
            values = [ from, to, transactionId ];
        } else if (from && to) {
            where = 'WHERE od.ArriveAt >= ? AND od.ArriveAt <= ?';
            values = [ from, to ];
        } else if (transactionId) {
            where = 'WHERE od.ReceiverTransactionAreaID = ?';
            values = [ transactionId ];
        }
        var sql = 
            'SELECT od.id, os.current_status ' +
            'FROM `ORDER` od ' +
            'JOIN order_status os ON od.id = os.order_id ' +
            `${where}`;
        const [rows] = await pool.query(sql, values);
        return rows;
    }

    async countSendOrder(from, to, transactionId) {
        let where = '';
        let values = [];
        if (from && to && transactionId) {
            where = 'WHERE time_create >= ? AND time_create <= ? AND departure_id = ?';
            values = [ from, to, transactionId ];
        } else if (from && to) {
            where = 'WHERE time_create >= ? AND time_create <= ?';
            values = [ from, to ];
        } else if (transactionId) {
            where = 'WHERE departure_id = ?';
            values = [ transactionId ];
        }
        var sql = 
            'SELECT COUNT(*) FROM STATISTIC_ORDER ' +
            `${where}`;
        const [rows] = await pool.query(sql, values);
        return rows[0]['COUNT(*)'];
    }

    async countReceiveOrder(from, to, transactionId) {
        let where = '';
        let values = [];
        if (from && to && transactionId) {
            where = 'WHERE time_create >= ? AND time_create <= ? AND destination_id = ?';
            values = [ from, to, transactionId ];
        } else if (from && to) {
            where = 'WHERE time_create >= ? AND time_create <= ?';
            values = [ from, to ];
        } else if (transactionId) {
            where = 'WHERE destination_id = ?';
            values = [ transactionId ];
        }
        var sql = 
            'SELECT COUNT(*) FROM STATISTIC_ORDER ' +
            `${where}`;
        const [rows] = await pool.query(sql, values);
        return rows[0]['COUNT(*)'];
    }

    async createStatisticOrder(param) {
        var sql = 'INSERT INTO STATISTIC_ORDER SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }
}

module.exports = new StatisticModel;
