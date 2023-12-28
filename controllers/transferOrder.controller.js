const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');
const transferOrderModel = require('../models/transferOrder.model');

const transactionModel = require('../models/transaction.model');

class TransferOrderController {
    async getTransferOrderOfTransaction(req, res, next) {
        const id = req.session.user.transaction;
        const page = req.query.page ? req.query.page : 1;

        const orders = await transferOrderModel.getTransferOrder({ destination_id: id }, page);
        let orderList = [];
        for (let order of orders) {
            orderList.push({
                id: order.order_id,
                sendTime: order.send_time,
                departureId: order.departure_id,
                destinationId: order.destination_id,
                type: order.type,
                action: [ `/order/acceptOrder/${order.order_id}` ]
            });
        }
        res.status(200).json(orderList);
    }

    async createTransferOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        const param = {};

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        param.order_id = req.params.id;

        const orderStatus = await orderStatusModel.getOrderStatusById(param.order_id);
        if (orderStatus.current_status == 'received') {
            res.status(400).json({ message: 'customer has received this order' });
            return;
        } else if (orderStatus.current_status == 'received_back') {
            res.status(400).json({ message: 'customer has received this order' });
            return;
        } else if (orderStatus.current_status == 'destroyed') {
            res.status(400).json({ message: 'this order has been destroyed' });
            return;
        } else {
            param.type = orderStatus.current_status;
        }

        param.departure_id = req.session.user.transaction;
        if (!req.params.destination) {
            res.status(400).json({ message: 'destination id is required' });
            return;
        }
        param.destination_id = req.params.destination;
        param.send_time = now;
        param.current_status = "arriving";

        await transferOrderModel.createTransferOrder(param);
        await orderStatusModel.updateOrderStatus({ current_position: null }, { order_id: req.params.id });

        res.status(201).json({ message: 'Success' });
    }

    async acceptTransferOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.params.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.params.id;
        const userTransaction = req.session.user.transaction;

        const update = {};
        update.current_position = userTransaction;
        update.last_position = userTransaction;

        const transferOrder = await transferOrderModel.getTransferOrderById(id);
        const orderType = transferOrder.type;

        const order = await orderModel.getOrderById(id);
        const senderTransaction = order.SenderTransactionAreaID;
        const senderTrans = await transactionModel.getTransactionById(senderTransaction);
        const senderGathering = senderTrans.gatheringId;

        const receiverTransaction = order.ReceiverTransactionAreaID;
        const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
        const receiverGathering = receiverTrans.gatheringId;

        if (!order) {
            res.status(400).json({ message: 'invalid required' });
            return;
        } else if (orderType == 'send') {
            if (userTransaction == senderTransaction) update.time_send_trans1 = now;
            if (userTransaction == senderGathering) update.time_send_gather1 = now;
            if (userTransaction == receiverGathering) update.time_send_gather2 = now;
            if (userTransaction == receiverTransaction) update.time_send_trans2 = now;
            update.last_update = now;
        } else if (orderType == 'return') {
            if (userTransaction == senderTransaction) update.time_return_trans1 = now;
            if (userTransaction == senderGathering) update.time_return_gather1 = now;
            if (userTransaction == receiverGathering) update.time_return_gather2 = now;
            if (userTransaction == receiverTransaction) update.time_return_trans2 = now;
            update.last_update = now;
        }

        await orderStatusModel.updateOrderStatus(update, { order_id: id })
        await transferOrderModel.deleteTransferOrder(id);
        res.status(201).json({ message: 'Success' });
    }
}

module.exports = new TransferOrderController;
