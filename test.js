var pool = require('./config/db');

async function getLastTransactionId() {
    let sql =
        'SELECT TransactionAreaID ' +
        'FROM TRANSACTION_AREA ' +
        'WHERE TransactionAreaID LIKE "GD____" ' +
        'ORDER BY TransactionAreaID DESC LIMIT 1';
    const [rows] = await pool.query(sql);
    return rows[0].TransactionAreaID;
}
getLastTransactionId();