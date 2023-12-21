const schema = require('./schema')

const {
    selectQuery,
    insertQuery,
    updateQuery,
} = require('../utils/query');

class OrderModel {
    getOrder(param) {
        var sql = selectQuery('*', '`ORDER`', param);
        return schema.get(sql);
    }

    createOrder(param) {
        var sql = insertQuery('`ORDER`', param);
        return schema.insert(sql);
    }

    updateOrder(param, condition) {
        var sql = updateQuery('`ORDER`', param, condition);
        return schema.update(sql);
    }
}

module.exports = new OrderModel;
