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
            if (req.query.transaction) {
                transactionId = req.query.transaction;
            }
        }
        if (!req.query.timestamp) {
            res.status(400).json({ message: 'timestamp is required' });
            return;
        } else {
            if (req.query.timestamp == '1ngay') {
                let orderStatusList = [];
                for (let i = 0; i < 24; i++) {
                    let date = new Date();
                    date.setHours(date.getHours() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00:00`;
                    date.setHours(date.getHours() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00:00`;
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
            } else if (req.query.timestamp == '7ngay') {
                let orderStatusList = [];
                for (let i = 0; i < 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
                        from, to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.query.timestamp == '1thang') {
                let orderStatusList = [];

                var today = new Date();
                var day;
                if (today.getMonth() == 0) day = new Date(today.getFullYear() - 1, 12, 0).getDate();
                else day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

                for (let i = 0; i < day; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
            } else if (req.query.timestamp == '1nam') {
                let orderStatusList = [];
                for (let i = 0; i < 12; i++) {
                    let date = new Date();
                    date.setMonth(date.getMonth() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setMonth(date.getMonth() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
                        from, to,
                        status: {
                            success, fail, receivedBack, destroy 
                        }
                    });
                }
                res.status(200).json(orderStatusList);
            } else if (req.query.timestamp == 'toanbo') {
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
            if (req.query.transaction) {
                transactionId = req.query.transaction;
            }
        }
        if (!req.query.timestamp) {
            res.status(400).json({ message: 'timestamp is required' });
            return;
        } else {
            if (req.query.timestamp == '1ngay') {
                let sendReceiveOrderList = [];
                for (let i = 0; i < 24; i++) {
                    let date = new Date();
                    date.setHours(date.getHours() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00:00`;
                    date.setHours(date.getHours() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00:00`;
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
            } else if (req.query.timestamp == '7ngay') {
                let sendReceiveOrderList = [];
                for (let i = 0; i < 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
            } else if (req.query.timestamp == '1thang') {
                let sendReceiveOrderList = [];

                var today = new Date();
                var day;
                if (today.getMonth() == 0) day = new Date(today.getFullYear() - 1, 12, 0).getDate();
                else day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

                for (let i = 0; i < day; i++) {
                    let date = new Date();
                    date.setDate(date.getDate() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setDate(date.getDate() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
            } else if (req.query.timestamp == '1nam') {
                let sendReceiveOrderList = [];
                for (let i = 0; i < 12; i++) {
                    let date = new Date();
                    date.setMonth(date.getMonth() - i + 1);
                    let to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
                    date.setMonth(date.getMonth() - 1);
                    let from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 0:00:00`;
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
            } else if (req.query.timestamp == 'toanbo') {
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
