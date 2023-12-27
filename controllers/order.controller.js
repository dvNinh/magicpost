const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');

class OrderController {
    async getOrder(req, res, next) {
        const param = {};

        req.query.id? param.id = req.query.id : null;
        req.query.sender ? param.SenderID = req.query.sender : null;
        req.query.receiver ? param.ReceiverID = req.query.receiver : null;
        req.query.senderTransactionId ? param.SenderTransactionId = req.query.senderTransactionId : null;
        req.query.receiverTransactionId ? param.ReceiverTransactionId = req.query.receiverTransactionId : null;
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

        let orderList = [];
        for (let order of orders) {
            orderList.push({
                id: order.id,
                sender: order.SenderID,
                receiver: order.ReceiverID,
                senderTransactionId: order.SenderTransactionAreaID,
                receiverTransactionId: order.ReceiverTransactionAreaID,
                arriveAt: order.ArriveAt,
                orderType: order.OrderType,
                orderInfo: order.OrderInfo,
                price: JSON.parse(order.Price),
                attachedFile: order.AttachedFile,
                weight: order.Weight,
                shippingCost: order.ShippingCost,
                othersCost: order.OthersCost,
                notes: order.Notes
            });
        }
        res.status(200).json(orderList);
    }

    async createOrder(req, res, next) {
        let date = new Date();
        let today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`.substring(2);
        let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        const lastOrderId = await orderModel.getLastOrderId(today);
        if (lastOrderId === `DH${today}999999`) {
            res.status(201).json({ message: 'da tao toi da don hang' });
            return;
        }
        let newOderId = `DH${today}` + String(parseInt(lastOrderId.substring(8)) + 1).padStart(6, '0');

        const param = {};

        param.id = newOderId;
        req.body.sender ? param.SenderID = req.body.sender : null;
        req.body.receiver ? param.ReceiverID = req.body.receiver : null;

        if (!req.body.senderTransactionId) {
            res.status(400).json({ message: 'sender transaction is required' });
            return;
        }
        param.SenderTransactionAreaID = req.body.senderTransactionId;

        if (!req.body.receiverTransactionId) {
            res.status(400).json({ message: 'receiver transaction is required' });
            return;
        }
        param.ReceiverTransactionAreaID = req.body.receiverTransactionId;
        
        if (!req.body.weight) {
            res.status(400).json({ message: 'weight is required' });
            return;
        }
        param.Weight = req.body.weight;

        param.ArriveAt = now;
        req.body.orderType ? param.OrderType = req.body.orderType : null;
        req.body.orderInfo ? param.OrderInfo = req.body.orderInfo : null;

        price = {};
        if (req.body.senderTransactionId == req.body.receiverTransactionId) {
            if (req.body.weight <= 1000) price.mainCharge = 10000
            else price.mainCharge = 10000 + (req.body.weight - 1000) * 2
        } else {
            if (req.body.weight <= 1000) price.mainCharge = 13000
            else price.mainCharge = 13000 + (req.body.weight - 1000) * 3
        }
        price.surcharge = price.mainCharge * 10 / 100;
        price.vat = (price.mainCharge + price.surcharge) * 10 / 100;
        price.total = price.mainCharge + price.surcharge + price.vat;

        param.Price = JSON.stringify(price);
        param.ShippingCost = 15000;
        req.body.othersCost ? param.OthersCost = req.body.othersCost : null;

        req.body.attachedFile ? param.AttachedFile = req.body.attachedFile : null;
        req.body.notes ? param.Notes = req.body.notes : null;

        await orderModel.createOrder(param);
        await orderStatusModel.createOrderStatus({
            order_id: newOderId,
            time_send_trans1: now,
            current_status: 'send',
            current_position: req.body.senderTransactionId
        });

        const order = await orderModel.getOrderById(newOderId);

        res.status(201).json(order);
    }

    async updateOrder(req, res, next) {
        const update = {};

        req.body.sender ? update.SenderID = req.body.sender : null;
        req.body.receiver ? update.ReceiverID = req.body.receiver : null;
        // req.body.senderTransactionId ? update.SenderTransactionAreaID = req.body.senderTransactionId : null;
        // req.body.receiverTransactionId ? update.ReceiverTransactionAreaID = req.body.receiverTransactionId : null;
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
        req.query.sender ? condition.SenderID = req.query.sender : null;
        req.query.receiver ? condition.ReceiverID = req.query.receiver : null;
        req.query.senderTransactionId ? condition.SenderTransactionAreaID = req.query.senderTransactionId : null;
        req.query.receiverTransactionId ? condition.ReceiverTransactionAreaID = req.query.receiverTransactionId : null;
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
