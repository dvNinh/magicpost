const express = require('express');
const router = express.Router();

const loginController = require('./controllers/login.controller');
const authController = require('./controllers/auth.controller');
const accountController = require('./controllers/account.controller');
const cityController = require('./controllers/city.controller');
const districtController = require('./controllers/district.controller');
const transactionController = require('./controllers/transaction.controller');
const gatheringController = require('./controllers/gathering.controller');
const orderController = require('./controllers/order.controller');

router.post('/login', loginController.login);
router.get('/logout', authController.isLogged, loginController.logout);
router.get('/role', authController.isLogged, loginController.getRole);

router.get('/account', authController.isManager, accountController.getAccount);
router.post('/account', authController.isManager, accountController.createAccount);
router.put('/account', authController.isLogged, accountController.updateAccount);
router.delete('/account', authController.isManager, accountController.deleteAccount);

router.get('/city', authController.isLogged, cityController.getCity);
router.get('/city/:id', authController.isLogged, cityController.getCityById);
router.get('/city/getDistricts/:id', authController.isLogged, districtController.getDistrictByCityId);

router.get('/district', authController.isLogged, districtController.getDistrict);
router.get('/district/:id', authController.isLogged, districtController.getDistrictById);

router.get('/transaction', authController.isTransactionManager, transactionController.getTransaction);
router.post('/transaction', authController.isLeader, transactionController.createTransaction);
router.put('/transaction', authController.isLeader, transactionController.updateTransaction);
router.delete('/transaction', authController.isLeader, transactionController.deleteTransaction);

router.get('/gathering', authController.isGatheringManager, gatheringController.getGathering);
router.post('/gathering', authController.isLeader, gatheringController.createGathering);
router.put('/gathering', authController.isLeader, gatheringController.updateGathering);
router.delete('/gathering', authController.isLeader, gatheringController.deleteGathering);

router.get('/order', authController.isLogged, orderController.getOrder);
router.post('/order', authController.isLogged, orderController.createOrder);
router.put('/order', authController.isLogged, orderController.updateOrder);

module.exports = router;