function paramCreator(key, value) {
    if (!key || !value) return '';
    else return `${key} = ${JSON.stringify(value)}`;
}

function keyValueCreator(params, delimiter) {
    if (!params) return '';
    let paramKeys = Object.keys(params);
    if (paramKeys.length === 0) return '';
    let result = ''
    let firstParam = true;
    for (let i = 0; i < paramKeys.length; i++) {
        let param = `${paramCreator(paramKeys[i], params[paramKeys[i]])}`;
        if (param === '') continue;
        if (firstParam) firstParam = false;
        else result += `${delimiter}`;
        result += param;
    }
    return result;
}

function selectQuery(filter, tableName, params, other) {
    let result = `SELECT`;
    result += ` ${filter}`;
    result += ` FROM ${tableName}`;
    let where = keyValueCreator(params, ' and ');
    if (where != '') result += ` WHERE ${where}`;
    if (other) result += other
    return result;
}

function paramsInsertCreator(params) {
    let keys = '';
    let values = '';
    let paramKeys = Object.keys(params);
    let firstParam = true;
    for (let i = 0; i < paramKeys.length; i++) {
        if (!params[paramKeys[i]]) continue;
        if (firstParam) firstParam = false;
        else {
            keys += ', ';
            values += ', '
        }
        keys += `${paramKeys[i]}`;
        values += `${JSON.stringify(params[paramKeys[i]])}`;
    }
    return { keys, values };
}

function insertQuery(tableName, params) {
    let result = `INSERT INTO ${tableName}`;
    let kv = paramsInsertCreator(params);
    result += ` (${kv['keys']}) VALUES (${kv['values']})`;
    return result;
}

function updateQuery(tableName, update, condition) {
    let result = `UPDATE ${tableName}`;
    result += ` SET ${keyValueCreator(update, ', ')}`;
    let where = keyValueCreator(condition, ' and ');
    if (where != '') result += ` WHERE ${where}`;
    return result;
}

function deleteQuery(tableName, param) {
    let result = `DELETE FROM ${tableName}`;
    let where = keyValueCreator(param, ' and ');
    if (where != '') result += ` WHERE ${where}`;
    return result;
}

module.exports = {
    selectQuery,
    insertQuery,
    updateQuery,
    deleteQuery
};
