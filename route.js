const express = require('express');
const router = express.Router();

const transactionController = require('./controllers/transaction');
const orderController = require('./controllers/order');
const accountController = require('./controllers/account');

router.get('/transaction', transactionController.getTransaction);
router.post('/transaction', transactionController.createTransaction);
router.put('/transaction', transactionController.updateTransaction);
router.delete('/transaction', transactionController.deleteTransaction);

router.get('/order', orderController.getOrder);
router.post('/order', orderController.createOrder);
router.put('/order', orderController.updateOrder);

router.get('/account', accountController.getAccount);
router.post('/account', accountController.createAccount);
router.put('/account', accountController.updateAccount);
router.delete('/account', accountController.deleteAccount);

module.exports = router;