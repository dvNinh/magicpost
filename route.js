const express = require('express');
const router = express.Router();

const loginController = require('./controllers/login.controller');
const authController = require('./controllers/auth.controller');
const accountController = require('./controllers/account.controller');
const transactionController = require('./controllers/transaction.controller');
const orderController = require('./controllers/order.controller');

router.post('/login', loginController.login);
router.get('/logout', authController.isLogged, loginController.logout);
router.get('/role', authController.isLogged, loginController.getRole);

router.get('/account', authController.isManager, accountController.getAccount);
router.post('/account', authController.isManager, accountController.createAccount);
router.put('/account', authController.isLogged, accountController.updateAccount);
router.delete('/account', authController.isManager, accountController.deleteAccount);

router.get('/transaction', authController.isTransactionManager, transactionController.getTransaction);
router.post('/transaction', authController.isLeader, transactionController.createTransaction);
router.put('/transaction', authController.isLeader, transactionController.updateTransaction);
router.delete('/transaction', authController.isLeader, transactionController.deleteTransaction);

router.get('/order', authController.isLogged, orderController.getOrder);
router.post('/order', authController.isLogged, orderController.createOrder);
router.put('/order', authController.isLogged, orderController.updateOrder);

module.exports = router;