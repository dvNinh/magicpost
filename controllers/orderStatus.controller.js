const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');

const transactionModel = require('../models/transaction.model');
const gatheringModel = require('../models/gathering.model');
const statisticModel = require('../models/statistic.model');

async function getAction(orderStatus) {
    const order = await orderModel.getOrderById(orderStatus.order_id);
    const senderTransaction = order.SenderTransactionAreaID;
    const senderTrans = await transactionModel.getTransactionById(senderTransaction);
    const senderGathering = senderTrans.gatheringId;

    const receiverTransaction = order.ReceiverTransactionAreaID;
    const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
    const receiverGathering = receiverTrans.gatheringId;

    let action = {};

    if (orderStatus.current_status == 'send') {
        if (orderStatus.current_position == receiverTransaction) {
            if (!orderStatus.time_ship) action = { ship: `/order/ship/${orderStatus.order_id}` };
            else action = {
                successOrder: `/order/success/${orderStatus.order_id}`,
                failOrder: `/order/fail/${orderStatus.order_id}`
            };
        } else if (orderStatus.current_position == receiverGathering) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${receiverTransaction}` };
        } else if (orderStatus.current_position == senderGathering) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${receiverGathering}` };
        } else if (orderStatus.current_position == senderTransaction) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${senderGathering}` };
        }
    } else if (orderStatus.current_status == 'return') {
        if (orderStatus.current_position == senderTransaction) {
            if (!orderStatus.time_ship_back) action = { shipBack: `/order/shipBack/${orderStatus.order_id}` };
            else action = {
                backSuccess: `/order/backSuccess/${orderStatus.order_id}`,
                destroy: `/order/backFail/${orderStatus.order_id}`
            };
        } else if (orderStatus.current_position == senderGathering) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${senderTransaction}` };
        } else if (orderStatus.current_position == receiverGathering) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${senderGathering}` };
        } else if (orderStatus.current_position == receiverTransaction) {
            action = { send: `/order/sendOrder/${orderStatus.order_id}/${receiverGathering}` };
        }
    }

    return action;
}

class OrderStatusController {
    async getOrderOfTransaction(req, res, next) {
        const id = req.session.user.transaction;
        const page = req.query.page ? req.query.page : 1;

        const orders = await orderStatusModel.getOrderStatus({ current_position: id }, page);
        let orderList = [];
        for (let order of orders) {
            let status = await this.getOrderStatus(order);
            let action = await getAction(order);
            let od = {
                id: order.order_id,
                lastUpdate: order.last_update,
                status,
                action,
            }
            orderList.push(od);
        }
        res.status(200).json(orderList);
    }

    async shipOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_ship: now,
            last_update: now,
        }, { order_id: id });

        res.status(201).json({ message: 'Success' });
    }

    async successOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_receive: now,
            current_status: 'received',
            last_update: now,
            current_position: null,
        }, { order_id: id });

        await statisticModel.createStatisticOrder({
            order_id: id,
	        departure_id: req.session.user.transaction,
	        destination_id: 'receiver',
	        time_create: now
        });

        res.status(201).json({ message: 'Success' });
    }

    async failOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_return_trans1: now,
            current_status: 'return',
            last_update: now,
        }, { order_id: id });

        res.status(201).json({ message: 'Success' });
    }

    async shipBackOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_ship_back: now,
            last_update: now,
        }, { order_id: id });

        res.status(201).json({ message: 'Success' });
    }

    async receivedBackSuccessOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_receive_back: now,
            current_status: 'received_back',
            last_update: now,
            current_position: null,
        }, { order_id: id });

        await statisticModel.createStatisticOrder({
            order_id: id,
	        departure_id: req.session.user.transaction,
	        destination_id: 'sender',
	        time_create: now
        });

        res.status(201).json({ message: 'Success' });
    }

    async receivedBackFailOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;

        await orderStatusModel.updateOrderStatus({
            time_destroy: now,
            current_status: 'destroyed',
            last_update: now,
            current_position: null,
        }, { order_id: id });

        await statisticModel.createStatisticOrder({
            order_id: id,
	        departure_id: req.session.user.transaction,
	        destination_id: 'destroy',
	        time_create: now
        });

        res.status(201).json({ message: 'Success' });
    }

    async getOrderStatus(orderStatus) {
        const order = await orderModel.getOrderById(orderStatus.order_id);
        const senderTransaction = order.SenderTransactionAreaID;
        const senderTrans = await transactionModel.getTransactionById(senderTransaction);
        const senderGathering = senderTrans.gatheringId;
        const senderGather = await gatheringModel.getGatheringById(senderGathering);
    
        const receiverTransaction = order.ReceiverTransactionAreaID;
        const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
        const receiverGathering = receiverTrans.gatheringId;
        const receiverGather = await gatheringModel.getGatheringById(receiverGathering);

        let status = [];
        if (orderStatus.time_send_trans1) {
            status.push({
                time: orderStatus.time_send_trans1,
                position: senderTransaction,
                name: senderTrans.TransactionAreaNAME,
                status: 'receive'
            });
        }
        if (orderStatus.time_leave_s_trans1) {
            status.push({
                time: orderStatus.time_leave_s_trans1,
                position: null,
                name: null,
                status: 'receive'
            });
        }

        if (orderStatus.time_send_gather1) {
            status.push({
                time: orderStatus.time_send_gather1,
                position: senderGathering,
                name: senderGather.name,
                status: 'send'
            });
        }
        if (orderStatus.time_leave_s_gather1) {
            status.push({
                time: orderStatus.time_leave_s_gather1,
                position: null,
                name: null,
                status: 'send'
            });
        }

        if (orderStatus.time_send_gather2) {
            status.push({
                time: orderStatus.time_send_gather2,
                position: receiverGathering,
                name: receiverGather.name,
                status: 'send'
            });
        }
        if (orderStatus.time_leave_s_gather2) {
            status.push({
                time: orderStatus.time_leave_s_gather2,
                position: null,
                name: null,
                status: 'send'
            });
        }

        if (orderStatus.time_send_trans2) {
            status.push({
                time: orderStatus.time_send_trans2,
                position: receiverTransaction,
                name: receiverTrans.TransactionAreaNAME,
                status: 'send'
            });
        }
        if (orderStatus.time_ship) {
            status.push({
                time: orderStatus.time_ship,
                position: null,
                name: null,
                status: 'ship'
            });
        }

        if (orderStatus.time_receive) {
            status.push({
                time: orderStatus.time_receive,
                position: null,
                name: null,
                status: 'success'
            });
        }

        if (orderStatus.time_return_trans2) {
            status.push({
                time: orderStatus.time_return_trans2,
                position: receiverTransaction,
                name: receiverTrans.TransactionAreaNAME,
                status: 'fail'
            });
        }
        if (orderStatus.time_leave_r_trans2) {
            status.push({
                time: orderStatus.time_leave_r_trans2,
                position: null,
                name: null,
                status: 'return'
            });
        }

        if (orderStatus.time_return_gather2) {
            status.push({
                time: orderStatus.time_return_gather2,
                position: receiverGathering,
                name: receiverGather.name,
                status: 'return'
            });
        }
        if (orderStatus.time_leave_r_gather2) {
            status.push({
                time: orderStatus.time_leave_r_gather2,
                position: null,
                name: null,
                status: 'return'
            });
        }

        if (orderStatus.time_return_gather1) {
            status.push({
                time: orderStatus.time_return_gather1,
                position: senderGathering,
                name: senderGather.name,
                status: 'return'
            });
        }
        if (orderStatus.time_leave_r_gather1) {
            status.push({
                time: orderStatus.time_leave_r_gather1,
                position: null,
                name: null,
                status: 'return'
            });
        }

        if (orderStatus.time_return_trans1) {
            status.push({
                time: orderStatus.time_return_trans1,
                position: senderTransaction,
                name: senderTrans.TransactionAreaNAME,
                status: 'return'
            });
        }
        if (orderStatus.time_ship_back) {
            status.push({
                time: orderStatus.time_ship_back,
                position: null,
                name: null,
                status: 'shipBack'
            });
        }

        if (orderStatus.time_receive_back) {
            status.push({
                time: orderStatus.time_receive_back,
                position: null,
                name: null,
                status: 'receiveBack'
            });
        }

        if (orderStatus.time_destroy) {
            status.push({
                time: orderStatus.time_destroy,
                position: null,
                name: null,
                status: 'destroy'
            });
        }
        return status;
    }
}

module.exports = new OrderStatusController;