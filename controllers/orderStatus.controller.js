const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');

class OrderStatusController {
    async getOrderOfTransaction(req, res, next) {
        const id = req.session.user.transaction;
        const page = req.query.page ? req.query.page : 1;

        const orders = await orderStatusModel.getOrderStatus({ current_position: id }, page);
        let orderList = [];
        for (let order of orders) {
            orderList.push({
                id: order.order_id,
                timeSendTrans1: order.time_send_trans1,
	            timeSendGather1: order.time_send_gather1,
	            timeSendGather2: order.time_send_gather2,
	            timeSendTrans2: order.time_send_trans2,
	            timeShip: order.time_ship,
	            timeReceive: order.time_receive,
	            timeReturnTrans1: order.time_return_trans1,
	            timeReturnGather1: order.time_return_gather1,
	            timeReturnGather2: order.time_return_gather2,
	            timeReturnTrans2: order.time_return_trans2,
	            timeShipBack: order.time_ship_back,
	            timeReceiveBack: order.time_receive_back,
	            timeDestroy: order.time_destroy,
	            currentStatus: order.current_status,
	            currentPosition: order.current_position
            });
        }
        res.status(200).json(orderList);
    }

    async shipOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_ship: now }, { orderId: id });
    }

    async successOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_receive: now, current_status: 'received' }, { orderId: id });
    }

    async failOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_return_trans1: now, current_status: 'return' }, { orderId: id });
    }

    async shipBackOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_ship_back: now }, { orderId: id });
    }

    async receivedBackSuccessOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_receive_back: now, current_status: 'received_back' }, { orderId: id });
    }

    async receivedBackFailOrder(req, res, next) {
        let date = new Date();
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if (!req.body.orderId) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.body.orderId;

        await orderStatusModel.updateOrderStatus({ time_destroy: now, current_status: 'destroyed' }, { orderId: id });
    }
}

module.exports = new OrderStatusController;