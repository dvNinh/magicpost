const orderModel = require('../models/order.model');

const pool = require('../config/db');

class OrderController {
    async getOrder(req, res, next) {
        if (req.query.id) {
            const order = await orderModel.getOrderById(req.query.id);
            res.status(200).json(order);
        } else {
            const param = {};
            req.query.senderId ? param.SenderID = req.query.senderId : null;
            req.query.receiverId ? param.ReceiverID = req.query.receiverId : null;
            req.query.senderTransactionAreaID ? param.SenderTransactionAreaID = req.query.senderTransactionAreaID : null;
            req.query.receiverTransactionAreaID ? param.ReceiverTransactionAreaID = req.query.receiverTransactionAreaID : null;
            req.query.arriveAt ? param.ArriveAt = req.query.arriveAt : null;
            req.query.orderType ? param.OrderType = req.query.orderType : null;
            req.query.orderInfo ? param.OrderInfo = req.query.orderInfo : null;
            req.query.price ? param.Price = req.query.price : null;
            req.query.attachedFile ? param.AttachedFile = req.query.attachedFile : null;
            req.query.weight ? param.Weight = req.query.weight : null;
            req.query.shippingCost ? param.ShippingCost = req.query.shippingCost : null;
            req.query.othersCost ? param.OthersCost = req.query.othersCost : null;
            req.query.notes ? param.Notes = req.query.notes : null;
            const page = req.query.page ? req.query.page : 1;
            const orders = await orderModel.getOrder(param, page);
            console.log(orders);
            let orderList = [];
            for (let order of orders) {
                orderList.push({
                    id: order.id,
                    senderId: order.SenderID,
                    receiverId: order.ReceiverID,
                    senderTransactionAreaID: order.SenderTransactionAreaID,
                    receiverTransactionAreaID: order.ReceiverTransactionAreaID,
                    arriveAt: order.ArriveAt,
                    orderType: order.OrderType,
                    orderInfo: order.OrderInfo,
                    price: order.Price,
                    attachedFile: order.AttachedFile,
                    weight: order.Weight,
                    shippingCost: order.ShippingCost,
                    othersCost: order.OthersCost,
                    notes: order.Notes
                });
            }
            res.status(200).json(orderList);
        }
    }

    async createOrder(req, res, next) {
        let date = new Date();
        let today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`.substring(2);
        let sql =
            'SELECT id ' +
            'FROM `ORDER` ' +
            `WHERE id LIKE "DH${today}______" ` +
            'ORDER BY id DESC LIMIT 1';
        const lastOrder = await pool.query(sql);
        let lastOrderId = lastOrder[0][0] ? lastOrder[0][0]['id'] : `DH${today}000000`;
        if (lastOrderId === `DH${today}999999`) {
            res.status(201).json({ message: 'da tao toi da don hang' });
        } else {
            let newOderId = 'DH' + String(parseInt(lastOrderId.substring(2)) + 1).padStart(6, '0');
            const param = {};
            param.id = newOderId;
            req.body.senderId ? param.SenderID = req.body.senderId : null;
            req.body.receiverId ? param.ReceiverID = req.body.receiverId : null;
            req.body.senderTransactionAreaID ? param.SenderTransactionAreaID = req.body.senderTransactionAreaID : null;
            req.body.receiverTransactionAreaID ? param.ReceiverTransactionAreaID = req.body.receiverTransactionAreaID : null;
            req.body.arriveAt ? param.ArriveAt = req.body.arriveAt : null;
            req.body.orderType ? param.OrderType = req.body.orderType : null;
            req.body.orderInfo ? param.OrderInfo = req.body.orderInfo : null;
            req.body.price ? param.Price = req.body.price : null;
            req.body.attachedFile ? param.AttachedFile = req.body.attachedFile : null;
            req.body.weight ? param.Weight = req.body.weight : null;
            req.body.shippingCost ? param.ShippingCost = req.body.shippingCost : null;
            req.body.othersCost ? param.OthersCost = req.body.othersCost : null;
            req.body.notes ? param.Notes = req.body.notes : null;
            await orderModel.createOrder(param);
            res.status(201).json({ message: 'Success' });
        }
    }

    async updateOrder(req, res, next) {
        const update = {};
        req.body.senderId ? update.SenderID = req.body.senderId : null;
        req.body.receiverId ? update.ReceiverID = req.body.receiverId : null;
        req.body.senderTransactionAreaID ? update.SenderTransactionAreaID = req.body.senderTransactionAreaID : null;
        req.body.receiverTransactionAreaID ? update.ReceiverTransactionAreaID = req.body.receiverTransactionAreaID : null;
        req.body.arriveAt ? update.ArriveAt = req.body.arriveAt : null;
        req.body.orderType ? update.OrderType = req.body.orderType : null;
        req.body.orderInfo ? update.OrderInfo = req.body.orderInfo : null;
        req.body.price ? update.Price = req.body.price : null;
        req.body.attachedFile ? update.AttachedFile = req.body.attachedFile : null;
        req.body.weight ? update.Weight = req.body.weight : null;
        req.body.shippingCost ? update.ShippingCost = req.body.shippingCost : null;
        req.body.othersCost ? update.OthersCost = req.body.othersCost : null;
        req.body.notes ? update.Notes = req.body.notes : null;
        const condition = {};
        req.query.id ? condition.id = req.query.id : null;
        req.query.senderId ? condition.SenderID = req.query.senderId : null;
        req.query.receiverId ? condition.ReceiverID = req.query.receiverId : null;
        req.query.senderTransactionAreaID ? condition.SenderTransactionAreaID = req.query.senderTransactionAreaID : null;
        req.query.receiverTransactionAreaID ? condition.ReceiverTransactionAreaID = req.query.receiverTransactionAreaID : null;
        req.query.arriveAt ? condition.ArriveAt = req.query.arriveAt : null;
        req.query.orderType ? condition.OrderType = req.query.orderType : null;
        req.query.orderInfo ? condition.OrderInfo = req.query.orderInfo : null;
        req.query.price ? condition.Price = req.query.price : null;
        req.query.attachedFile ? condition.AttachedFile = req.query.attachedFile : null;
        req.query.weight ? condition.Weight = req.query.weight : null;
        req.query.shippingCost ? condition.ShippingCost = req.query.shippingCost : null;
        req.query.othersCost ? condition.OthersCost = req.query.othersCost : null;
        req.query.notes ? condition.Notes = req.query.notes : null;
        await orderModel.updateOrder(update, condition);
        res.status(201).json({ message: 'Success' });
    }
}

module.exports = new OrderController;
