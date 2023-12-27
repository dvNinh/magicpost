const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');

class OrderStatusController {
    async getAction(orderStatus) {
        const order = await orderModel.getOrderById(orderStatus.order_id);
        const senderTransaction = order.SenderTransactionAreaID;
        const senderTrans = await transactionModel.getTransactionById(senderTransaction);
        const senderGathering = senderTrans.gatheringId;

        const receiverTransaction = order.ReceiverTransactionAreaID;
        const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
        const receiverGathering = receiverTrans.gatheringId;

        let action = [];

        if (orderStatus.currentStatus == 'send') {
            if (orderStatus.current_position == receiverTransaction) {
                if (!orderStatus.time_ship) action = [ `/order/ship/${orderStatus.order_id}` ];
                else action = [ `/order/success/${orderStatus.order_id}`, `/order/fail/${orderStatus.order_id}` ];
            } else if (orderStatus.current_position == receiverGathering) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${receiverTransaction}` ];
            } else if (orderStatus.current_position == senderGathering) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${receiverGathering}` ];
            } else if (orderStatus.current_position == senderTransaction) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${senderGathering}` ];
            }
        } else if (orderStatus.currentStatus == 'return') {
            if (orderStatus.current_position == senderTransaction) {
                if (!orderStatus.time_ship_back) action = [ `/order/shipBack/${orderStatus.order_id}` ];
                else action = [ `/order/backSuccess/${orderStatus.order_id}`, `/order/backFail/${orderStatus.order_id}` ];
            } else if (orderStatus.current_position == senderGathering) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${senderTransaction}` ];
            } else if (orderStatus.current_position == receiverGathering) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${senderGathering}` ];
            } else if (orderStatus.current_position == receiverTransaction) {
                action = [ `/order/sendOrder/${orderStatus.order_id}/${receiverGathering}` ];
            }
        }

        return action;
    }

    async getOrderStatus(orderStatus) {
        const order = await orderModel.getOrderById(orderStatus.order_id);
        const senderTransaction = order.SenderTransactionAreaID;
        const senderTrans = await transactionModel.getTransactionById(senderTransaction);
        const senderGathering = senderTrans.gatheringId;

        const receiverTransaction = order.ReceiverTransactionAreaID;
        const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
        const receiverGathering = receiverTrans.gatheringId;

        let status = [];
        if (orderStatus.time_send_trans1) {
            status.push({
                time: orderStatus.time_send_trans1,
                position: senderTransaction,
                description: `Don hang duoc gui tai diem giao dich ${senderTransaction}`
            });
        }
        if (orderStatus.time_send_gather1) {
            status.push({
                time: orderStatus.time_send_gather1,
                position: senderGathering,
                description: `Don hang den diem tap ket ${senderGathering}`
            });
        }
        if (orderStatus.time_send_gather2) {
            status.push({
                time: orderStatus.time_send_gather2,
                position: receiverGathering,
                description: `Don hang den diem tap ket ${receiverGathering}`
            });
        }
        if (orderStatus.time_send_trans2) {
            status.push({
                time: orderStatus.time_send_trans2,
                position: receiverTransaction,
                description: `Don hang den diem giao dich ${receiverTransaction}`
            });
        }
        if (orderStatus.time_ship) {
            status.push({
                time: orderStatus.time_ship,
                position: receiverTransaction,
                description: `Don hang dang chuyen den nguoi nhan`
            });
        }
        if (orderStatus.time_receive) {
            status.push({
                time: orderStatus.time_receive,
                position: receiverTransaction,
                description: `Nguoi nhan da nhan duoc hang`
            });
        }
        if (orderStatus.time_return_trans2) {
            status.push({
                time: orderStatus.time_return_trans2,
                position: receiverTransaction,
                description: `Giao hang ko thanh cong don hang quay lai diem giao dich ${receiverTransaction}`
            });
        }
        if (orderStatus.time_return_gather2) {
            status.push({
                time: orderStatus.time_return_gather2,
                position: receiverGathering,
                description: `Don hang quay lai diem tap ket ${receiverGathering}`
            });
        }
        if (orderStatus.time_return_gather1) {
            status.push({
                time: orderStatus.time_return_gather1,
                position: senderGathering,
                description: `Don hang quay lai tap ket ${senderGathering}`
            });
        }
        if (orderStatus.time_return_trans1) {
            status.push({
                time: orderStatus.time_return_trans1,
                position: senderTransaction,
                description: `Don hang quay lai giao dich ${senderTransaction}`
            });
        }
        if (orderStatus.time_ship_back) {
            status.push({
                time: orderStatus.time_ship_back,
                position: senderTransaction,
                description: `Don hang dang giao lai cho nguoi gui`
            });
        }
        if (orderStatus.time_receive_back) {
            status.push({
                time: orderStatus.time_receive_back,
                position: senderTransaction,
                description: `Da giao lai cho nguoi gui`
            });
        }
        if (orderStatus.time_destroy) {
            status.push({
                time: orderStatus.time_destroy,
                position: senderTransaction,
                description: `Giao lai cho nguoi gui ko thanh cong`
            });
        }
        return status;
    }

    async getOrderOfTransaction(req, res, next) {
        const id = req.session.user.transaction;
        const page = req.query.page ? req.query.page : 1;

        const orders = await orderStatusModel.getOrderStatus({ current_position: id }, page);
        let orderList = [];
        for (let order of orders) {
            let od = {
                id: order.order_id,
                lastUpdate: order.last_update,
                status: this.getOrderStatus(order),
                action: this.getAction(order),
            }
            orderList.push(od);
        }
        res.status(200).json(orderList);
    }

    async shipOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_ship: now, last_update: now }, { orderId: id });
    }

    async successOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_receive: now, current_status: 'received', last_update: now }, { orderId: id });
    }

    async failOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_return_trans1: now, current_status: 'return', last_update: now }, { orderId: id });
    }

    async shipBackOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_ship_back: now, last_update: now }, { orderId: id });
    }

    async receivedBackSuccessOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_receive_back: now, current_status: 'received_back', last_update: now }, { orderId: id });
    }

    async receivedBackFailOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.param.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.param.orderId;

        await orderStatusModel.updateOrderStatus({ time_destroy: now, current_status: 'destroyed', last_update: now }, { orderId: id });
    }
}

module.exports = new OrderStatusController;