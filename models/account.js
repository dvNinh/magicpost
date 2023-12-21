const schema = require('./schema')

const {
    selectQuery,
    insertQuery,
    updateQuery,
    deleteQuery
} = require('../utils/query');

class AccountModel {
    getAccount(param) {
        var sql = selectQuery(
            'ac.username, ac.EmployeeID, em.fullname, em.role',
            'ACCOUNT ac ' +
            'JOIN EMPLOYEES em ON ac.EmployeeID = em.id',
            param,
        );
        return schema.get(sql);
    }

    createAccount(param) {
        var sql = insertQuery('ACCOUNT', param);
        return schema.insert(sql);
    }

    updateAccount(param, condition) {
        var sql = updateQuery('ACCOUNT', param, condition);
        return schema.update(sql);
    }

    deleteAccount(param) {
        var sql = deleteQuery('ACCOUNT', param);
        return schema.delete(sql);
    }
}

module.exports = new AccountModel;