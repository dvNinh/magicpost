const schema = require('./schema')

const {
    selectQuery,
    insertQuery,
    updateQuery,
    deleteQuery
} = require('../utils/query');

class TransactionModel {
    getTransaction(param, page) {
        var sql = selectQuery(
            'ta.*, ct.CityName, dt.DistrictName',
            'TRANSACTION_AREA ta ' +
            'JOIN CITY ct ON ta.CityID = ct.CityID ' +
            'JOIN DISTRICT dt ON ta.DistrictID = dt.DistrictID and ta.CityID = dt.CityID',
            param,
            ` ORDER BY ta.TransactionAreaID ASC LIMIT ${(page - 1) * 10}, 10`
        );
        return schema.get(sql);
    }

    createTransaction(param) {
        var sql = insertQuery('TRANSACTION_AREA', param);
        return schema.insert(sql);
    }

    updateTransaction(param, condition) {
        var sql = updateQuery('TRANSACTION_AREA', param, condition);
        return schema.update(sql);
    }

    deleteTransaction(param) {
        var sql = deleteQuery('TRANSACTION_AREA', param);
        return schema.delete(sql);
    }
}

module.exports = new TransactionModel;
