const orderModel = require('../models/order');

class OrderController {
    async getOrder(req, res, next) {
        const param = {
            id: req.query.id,
	        SenderID: req.query.senderId,
	        ReceiverID: req.query.receiverId,
	        SenderTransactionAreaID: req.query.senderTransactionAreaID,
	        ReceiverTransactionAreaID: req.query.receiverTransactionAreaID,
	        ArriveAt: req.query.arriveAt,
	        OrderType: req.query.orderType,
	        OrderInfo: req.query.orderInfo,
	        Price: req.query.price,
	        AttachedFile: req.query.attachedFile,
	        Weight: req.query.weight,
	        ShippingCost: req.query.shippingCost,
	        OthersCost: req.query.othersCost,
	        Notes: req.query.notes
        };
        const orders = await orderModel.getTransaction(param);
        var orderList = [];
        for (var order of orders) {
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
                note: order.Notes,
            });
        }
        res.status(200).json(orderList);
    }

    async createOrder(req, res, next) {
        const param = {
            id: req.body.id,
	        SenderID: req.body.senderId,
	        ReceiverID: req.body.receiverId,
	        SenderTransactionAreaID: req.body.senderTransactionAreaID,
	        ReceiverTransactionAreaID: req.body.receiverTransactionAreaID,
	        ArriveAt: req.body.arriveAt,
	        OrderType: req.body.orderType,
	        OrderInfo: req.body.orderInfo,
	        Price: req.body.price,
	        AttachedFile: req.body.attachedFile,
	        Weight: req.body.weight,
	        ShippingCost: req.body.shippingCost,
	        OthersCost: req.body.othersCost,
	        Notes: req.body.notes
        };
        try {
            await orderModel.createOrder(param);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_DUP_ENTRY') {
                res.status(401).json({ message: 'id da ton tai' });
            }
        }
    }

    async updateOrder(req, res, next) {
        const update = {
            id: req.body.id,
	        SenderID: req.body.senderId,
	        ReceiverID: req.body.receiverId,
	        SenderTransactionAreaID: req.body.senderTransactionAreaID,
	        ReceiverTransactionAreaID: req.body.receiverTransactionAreaID,
	        ArriveAt: req.body.arriveAt,
	        OrderType: req.body.orderType,
	        OrderInfo: req.body.orderInfo,
	        Price: req.body.price,
	        AttachedFile: req.body.attachedFile,
	        Weight: req.body.weight,
	        ShippingCost: req.body.shippingCost,
	        OthersCost: req.body.othersCost,
	        Notes: req.body.notes
        };
        const condition = {
            id: req.query.id,
	        SenderID: req.query.senderId,
	        ReceiverID: req.query.receiverId,
	        SenderTransactionAreaID: req.query.senderTransactionAreaID,
	        ReceiverTransactionAreaID: req.query.receiverTransactionAreaID,
	        ArriveAt: req.query.arriveAt,
	        OrderType: req.query.orderType,
	        OrderInfo: req.query.orderInfo,
	        Price: req.query.price,
	        AttachedFile: req.query.attachedFile,
	        Weight: req.query.weight,
	        ShippingCost: req.query.shippingCost,
	        OthersCost: req.query.othersCost,
	        Notes: req.query.notes
        };
        try {
            await orderModel.updateOrder(update, condition);
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.log(e);
            if (e.code === 'ER_PARSE_ERROR') {
                res.status(401).json({ message: 'khong co thong tin cap nhat' });
            }
        }
    }
}

module.exports = new OrderController;
