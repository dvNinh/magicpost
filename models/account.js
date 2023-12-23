var pool = require('../config/db');

class AccountModel {
    async getAccountByUsername(id) {
        var sql = 
            // 'SELECT ac.username, ac.employees_id, em.full_name, em.role ' +
            'SELECT * ' +
            'FROM ACCOUNT ac ' +
            // 'JOIN EMPLOYEES em ON ac.employees_id = em.id ' +
            'WHERE username = ?';
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    async getAccount(param, page) {
        let where = '';
        if (Object.keys(param).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(param)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -4);
        }
        var sql = 
            // 'SELECT ac.username, ac.employees_id, em.full_name, em.role ' +
            'SELECT * ' +
            'FROM ACCOUNT ac ' +
            // 'JOIN EMPLOYEES em ON ac.employees_id = em.id ' +
            `${where}` +
            `ORDER BY username ASC LIMIT ${(page - 1) * 10}, 10`;
        const [rows] = await pool.query(sql, Object.values(param));
        return rows;
    }

    async createAccount(param) {
        var sql = 'INSERT INTO ACCOUNT SET ?';
        const [results] = await pool.query(sql, param);
        return results;
    }

    async updateAccount(update, condition) {
        let where = '';
        if (Object.keys(condition).length > 0) {
            where = 'WHERE ';
            for (const key of Object.keys(condition)) {
                where += `${key} = ? AND `;
            }
            where = where.slice(0, -5);
        }
        var sql = `UPDATE ACCOUNT SET ? ${where}`;
        const [results] = await pool.query(sql, [update, ...Object.values(condition)]);
        return results;
    }

    async deleteAccount(id) {
        var sql = 'DELETE FROM ACCOUNT WHERE username = ?';
        const [results] = await pool.query(sql, [id]);
        return results;
    }
}

module.exports = new AccountModel;
