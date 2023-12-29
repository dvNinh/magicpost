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
                let orderStatusList = [];
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
                    orderStatusList.push({
                        from,
                        to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '7ngay') {
                let orderStatusList = [];
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
                    orderStatusList.push({
                        from,
                        to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '1thang') {
                let orderStatusList = [];
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
                    orderStatusList.push({
                        from,
                        to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == '1nam') {
                let orderStatusList = [];
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
                    orderStatusList.push({
                        from,
                        to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.body.timestamp == 'toanbo') {
                const orderStatuses = await statisticModel.getOrderStatus(null, null, transactionId);
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
                res.status(200).json([{
                    from: null,
                    to: null,
                    status: {
                        success, fail, receivedBack, destroy 
                    }
                }]);
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
                let sendReceiveOrderList = [];
                for (let i = 1; i <= 24; i++) {
                    let date = new Date();
                    date.setHours(date.getHours() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setHours(date.getHours() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let send = 0, receive = 0;
                    if (!transactionId) {
                        send = await statisticModel.countReceiveOrder(from, to, 'receiver');
                        receive = await statisticModel.countSendOrder(from, to, 'sender');
                    } else {
                        send = await statisticModel.countSendOrder(from, to, transactionId);
                        receive = await statisticModel.countReceiveOrder(from, to, transactionId);
                    }
                    sendReceiveOrderList.push({
                        from, to,
                        status: { send, receive }
                    });
                }
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '7ngay') {
                let sendReceiveOrderList = [];
                for (let i = 1; i <= 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let send = 0, receive = 0;
                    if (!transactionId) {
                        send = await statisticModel.countReceiveOrder(from, to, 'receiver');
                        receive = await statisticModel.countSendOrder(from, to, 'sender');
                    } else {
                        send = await statisticModel.countSendOrder(from, to, transactionId);
                        receive = await statisticModel.countReceiveOrder(from, to, transactionId);
                    }
                    sendReceiveOrderList.push({
                        from, to,
                        status: { send, receive }
                    });
                }
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '1thang') {
                let sendReceiveOrderList = [];
                for (let i = 1; i <= 30; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let send = 0, receive = 0;
                    if (!transactionId) {
                        send = await statisticModel.countReceiveOrder(from, to, 'receiver');
                        receive = await statisticModel.countSendOrder(from, to, 'sender');
                    } else {
                        send = await statisticModel.countSendOrder(from, to, transactionId);
                        receive = await statisticModel.countReceiveOrder(from, to, transactionId);
                    }
                    sendReceiveOrderList.push({
                        from, to,
                        status: { send, receive }
                    });
                }
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == '1nam') {
                let sendReceiveOrderList = [];
                for (let i = 1; i <= 12; i++) {
                    let date = new Date();
                    date.setMonth(date.getMonth() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    date.setMonth(date.getMonth() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    let send = 0, receive = 0;
                    if (!transactionId) {
                        send = await statisticModel.countReceiveOrder(from, to, 'receiver');
                        receive = await statisticModel.countSendOrder(from, to, 'sender');
                    } else {
                        send = await statisticModel.countSendOrder(from, to, transactionId);
                        receive = await statisticModel.countReceiveOrder(from, to, transactionId);
                    }
                    sendReceiveOrderList.push({
                        from, to,
                        status: { send, receive }
                    });
                }
                res.status(200).json(sendReceiveOrderList);
            } else if (req.body.timestamp == 'toanbo') {
                let send = 0, receive = 0;
                if (!transactionId) {
                    send = await statisticModel.countReceiveOrder(null, null, 'receiver');
                    receive = await statisticModel.countSendOrder(null, null, 'sender');
                } else {
                    send = await statisticModel.countSendOrder(null, null, transactionId);
                    receive = await statisticModel.countReceiveOrder(null, null, transactionId);
                }
                res.status(200).json([{
                    from: null, to: null,
                    status: { send, receive }
                }]);
            }
        }
    }
}

module.exports = new StatisticController;
