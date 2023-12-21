var db = require('../config/db');

class Schema {
    get(sql) {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                var list = [];
                for (var result of results) {
                    list.push({...result});
                }
                return resolve(list);
            });
        });
    }

    insert(sql) {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    update(sql) {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    delete(sql) {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = new Schema;
