const transactionModel = require("../models/transaction.model");
const statisticModel = require("../models/statistic.model");

class StatisticController {
    async statisticOrderStatus(req, res, next) {
        let transactionId;
        if (req.session.user.role != 'leader') {
            transactionId = req.session.user.transaction;
            const transaction = await transactionModel.getTransactionById(transactionId);
            if (!transaction) {
                res.status(400).json({ message: 'access is not allowed' });
                return;
            }
        } else {
            if (req.body.transaction) {
                transactionId = req.body.transaction;
            }
        }
        if (!req.body.timestamp) {
            res.status(400).json({ message: 'timestamp is required' });
            return;
        } else {
            if (req.body.timestamp == '1ngay') {
                let orderStatusList = {};
                let totalSuccess = 0, totalFail = 0, totalReceivedBack = 0, totalDestroy = 0;
                for (let i = 1; i <= 24; i++) {
                    let date = new Date();
                    date.setHours(date.getHours() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setHours(date.getHours() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const orderStatuses = await statisticModel.getOrderStatus(from, to, transactionId);
                    let success = 0, fail = 0, receivedBack = 0, destroy = 0;
                    for (let orderStatus of orderStatuses) {
                        if (orderStatus.current_status == 'received') {
                            success++;
                            totalSuccess++;
                        } else if (orderStatus.current_status == 'return') {
                            fail++;
                            totalFail++;
                        } else if (orderStatus.current_status == 'received_back') {
                            fail++;
                            totalFail++;
                            receivedBack++;
                            totalReceivedBack++;
                        } else if (orderStatus.current_status == 'destroyed') {
                            fail++;
                            totalFail++;
                            destroy++;
                            totalDestroy++;
                        }
                    }
                    orderStatusList[i] = { success, fail, receivedBack, destroy };
                }
                orderStatusList.total = {
                    success: totalSuccess,
                    fail: totalFail,
                    receivedBack: totalReceivedBack,
                    destroy: totalDestroy
                };
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '7ngay') {
                let orderStatusList = {};
                let totalSuccess = 0, totalFail = 0, totalReceivedBack = 0, totalDestroy = 0;
                for (let i = 1; i <= 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const orderStatuses = await statisticModel.getOrderStatus(from, to, transactionId);
                    let success = 0, fail = 0, receivedBack = 0, destroy = 0;
                    for (let orderStatus of orderStatuses) {
                        if (orderStatus.current_status == 'received') {
                            success++;
                            totalSuccess++;
                        } else if (orderStatus.current_status == 'return') {
                            fail++;
                            totalFail++;
                        } else if (orderStatus.current_status == 'received_back') {
                            fail++;
                            totalFail++;
                            receivedBack++;
                            totalReceivedBack++;
                        } else if (orderStatus.current_status == 'destroyed') {
                            fail++;
                            totalFail++;
                            destroy++;
                            totalDestroy++;
                        }
                    }
                    orderStatusList[i] = { success, fail, receivedBack, destroy };
                }
                orderStatusList.total = {
                    success: totalSuccess,
                    fail: totalFail,
                    receivedBack: totalReceivedBack,
                    destroy: totalDestroy
                };
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '1thang') {
                let orderStatusList = {};
                let totalSuccess = 0, totalFail = 0, totalReceivedBack = 0, totalDestroy = 0;
                for (let i = 1; i <= 30; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const orderStatuses = await statisticModel.getOrderStatus(from, to, transactionId);
                    let success = 0, fail = 0, receivedBack = 0, destroy = 0;
                    for (let orderStatus of orderStatuses) {
                        if (orderStatus.current_status == 'received') {
                            success++;
                            totalSuccess++;
                        } else if (orderStatus.current_status == 'return') {
                            fail++;
                            totalFail++;
                        } else if (orderStatus.current_status == 'received_back') {
                            fail++;
                            totalFail++;
                            receivedBack++;
                            totalReceivedBack++;
                        } else if (orderStatus.current_status == 'destroyed') {
                            fail++;
                            totalFail++;
                            destroy++;
                            totalDestroy++;
                        }
                    }
                    orderStatusList[i] = { success, fail, receivedBack, destroy };
                }
                orderStatusList.total = {
                    success: totalSuccess,
                    fail: totalFail,
                    receivedBack: totalReceivedBack,
                    destroy: totalDestroy
                };
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '1nam') {
                let orderStatusList = {};
                let totalSuccess = 0, totalFail = 0, totalReceivedBack = 0, totalDestroy = 0;
                for (let i = 1; i <= 12; i++) {
                    let date = new Date();
                    date.setMonth(date.getMonth() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setMonth(date.getMonth() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const orderStatuses = await statisticModel.getOrderStatus(from, to, transactionId);
                    let success = 0, fail = 0, receivedBack = 0, destroy = 0;
                    for (let orderStatus of orderStatuses) {
                        if (orderStatus.current_status == 'received') {
                            success++;
                            totalSuccess++;
                        } else if (orderStatus.current_status == 'return') {
                            fail++;
                            totalFail++;
                        } else if (orderStatus.current_status == 'received_back') {
                            fail++;
                            totalFail++;
                            receivedBack++;
                            totalReceivedBack++;
                        } else if (orderStatus.current_status == 'destroyed') {
                            fail++;
                            totalFail++;
                            destroy++;
                            totalDestroy++;
                        }
                    }
                    orderStatusList[i] = { success, fail, receivedBack, destroy };
                }
                orderStatusList.total = {
                    success: totalSuccess,
                    fail: totalFail,
                    receivedBack: totalReceivedBack,
                    destroy: totalDestroy
                };
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == 'toanbo') {
                const orderStatuses = await statisticModel.getOrderStatus(null, transactionId);
                let success = 0, fail = 0, receivedBack = 0, destroy = 0;
                for (let orderStatus of orderStatuses) {
                    if (orderStatus.current_status == 'received') {
                        success++;
                    } else if (orderStatus.current_status == 'return') {
                        fail++;
                    } else if (orderStatus.current_status == 'received_back') {
                        fail++;
                        receivedBack++;
                    } else if (orderStatus.current_status == 'destroyed') {
                        fail++;
                        destroy++;
                    }
                }
                res.status(200).json({ success, fail, receivedBack, destroy });
            }
        }
    }

    async statisticSendReceiveOrder(req, res, next) {
        let transactionId;
        if (req.session.user.role != 'leader') {
            transactionId = req.session.user.transaction;
            if (!transactionId) {
                res.status(400).json({ message: 'access is not allowed' });
                return;
            }
        } else {
            if (req.body.transaction) {
                transactionId = req.body.transaction;
            }
        }
        if (!req.body.timestamp) {
            res.status(400).json({ message: 'timestamp is required' });
            return;
        } else {
            if (req.body.timestamp == '1ngay') {
                let sendReceiveOrderList = {};
                let totalSend = 0, totalReceive = 0;
                for (let i = 1; i <= 24; i++) {
                    let date = new Date();
                    date.setHours(date.getHours() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setHours(date.getHours() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let transaction = transactionId;
                    if (!transactionId) transaction = 'receiver';
                    const send = await statisticModel.countSendOrder(from, to, transaction);
                    if (!transactionId) transaction = 'sender';
                    const receive = await statisticModel.countReceiveOrder(from, to, transaction);
                    totalSend += send;
                    totalReceive += receive;
                    sendReceiveOrderList[i] = { send, receive };
                }
                sendReceiveOrderList.total = {
                    send: totalSend,
                    receive: totalReceive,
                };
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '7ngay') {
                let sendReceiveOrderList = {};
                let totalSend = 0, totalReceive = 0;
                for (let i = 1; i <= 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let transaction = transactionId;
                    if (!transactionId) transaction = 'receiver';
                    const send = await statisticModel.countSendOrder(from, to, transaction);
                    if (!transactionId) transaction = 'sender';
                    const receive = await statisticModel.countReceiveOrder(from, to, transaction);
                    totalSend += send;
                    totalReceive += receive;
                    sendReceiveOrderList[i] = { send, receive };
                }
                sendReceiveOrderList.total = {
                    send: totalSend,
                    receive: totalReceive,
                };
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '1thang') {
                let sendReceiveOrderList = {};
                let totalSend = 0, totalReceive = 0;
                for (let i = 1; i <= 30; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let transaction = transactionId;
                    if (!transactionId) transaction = 'receiver';
                    const send = await statisticModel.countSendOrder(from, to, transaction);
                    if (!transactionId) transaction = 'sender';
                    const receive = await statisticModel.countReceiveOrder(from, to, transaction);
                    totalSend += send;
                    totalReceive += receive;
                    sendReceiveOrderList[i] = { send, receive };
                }
                sendReceiveOrderList.total = {
                    send: totalSend,
                    receive: totalReceive,
                };
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '1nam') {
                let sendReceiveOrderList = {};
                let totalSend = 0, totalReceive = 0;
                for (let i = 1; i <= 12; i++) {
                    let date = new Date();
                    date.setMonth(date.getMonth() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setMonth(date.getMonth() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let transaction = transactionId;
                    if (!transactionId) transaction = 'receiver';
                    const send = await statisticModel.countSendOrder(from, to, transaction);
                    if (!transactionId) transaction = 'sender';
                    const receive = await statisticModel.countReceiveOrder(from, to, transaction);
                    totalSend += send;
                    totalReceive += receive;
                    sendReceiveOrderList[i] = { send, receive };
                }
                sendReceiveOrderList.total = {
                    send: totalSend,
                    receive: totalReceive,
                };
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == 'toanbo') {
                let totalSend = 0, totalReceive = 0;
                let transaction = transactionId;
                if (!transactionId) transaction = 'receiver';
                const send = await statisticModel.countReceiveOrder(null, null, transaction);
                if (!transactionId) transaction = 'sender';
                const receive = await statisticModel.countSendOrder(null, null, transaction);
                totalSend += send;
                totalReceive += receive;
                res.status(200).json({
                    send: totalSend,
                    receive: totalReceive,
                });
            }
        }
    }
}

module.exports = new StatisticController;
