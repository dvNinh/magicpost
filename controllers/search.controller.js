const transactionModel = require('../models/transaction.model');
const gatheringModel = require('../models/gathering.model');
const cityModel = require('../models/city.model');
const districtModel = require('../models/district.model');
const orderModel = require('../models/order.model');
const orderStatusModel = require('../models/orderStatus.model');
const orderStatusController = require('./orderStatus.controller');

class SearchController {
    async searchTransaction(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = !!parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = !!parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'ascending';

        const param = {};
        
        if (req.query.city) {
            const city = await cityModel.getCityById(req.query.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }

        if (req.query.district) {
            const district = await districtModel.getDistrictById(req.query.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }

        const transactions = await transactionModel.searchTransaction(searchValue, param, page, limit, sortOrder);
        let transactionList = [];
        for (let transaction of transactions) {
            let tran = {
                id: transaction.TransactionAreaID,
                name: transaction.TransactionAreaNAME,
                city: transaction.CityName,
                district: transaction.DistrictName,
                cityId: transaction.CityID,
                districtId: transaction.DistrictID,
                address: transaction.Address,
                coordinatesX: transaction.CoordinateX,
                coordinatesY: transaction.CoordinateY,
                gatheringId: transaction.gatheringId
            };
            if (req.session.user.role == 'leader') {
                tran.manager = transaction.Manager;
            }
            transactionList.push(tran);
        }
        res.status(200).json(transactionList);
    }

    async searchGathering(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = !!parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = !!parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'ascending';
        
        const param = {};
        
        if (req.query.city) {
            const city = await cityModel.getCityById(req.query.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }

        if (req.query.district) {
            const district = await districtModel.getDistrictById(req.query.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }

        const gatherings = await gatheringModel.searchGathering(searchValue, param, page, limit, sortOrder);
        let gatheringList = [];
        for (let gathering of gatherings) {
            let gather = {
                id: gathering.id,
                name: gathering.name,
                city: gathering.CityName,
                district: gathering.DistrictName,
                cityId: gathering.CityID,
                districtId: gathering.DistrictID,
                address: gathering.address,
                coordinatesX: gathering.coordinateX,
                coordinatesY: gathering.coordinateY,
            };
            if (req.session.user.role == 'leader') {
                gather.manager = gathering.manager;
            }
            gatheringList.push(gather);
        }
        res.status(200).json(gatheringList);
    }

    async searchOrder(req, res, next) {
        const searchValue = req.query.searchValue ? req.query.searchValue : '';
        const page = !!parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = !!parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'descending';

        let transaction;
        if (req.session.user.role == 'leader') {
            if (!req.query.transaction) {
                res.status(400).json({ message: 'transaction is required' });
                return;
            }
            transaction = req.query.transaction
        } else transaction = req.session.user.transaction;
        
        let from, to, filter;
        if (!req.query.filter) filter = [ 'Arriving', 'Processing', 'Departed', 'Returned', 'Discarded' ];
        else filter = req.query.filter;

        if (req.query.from) from = req.query.from;
        if (req.query.to) to = req.query.to;

        const orders = await orderModel.searchOrder(searchValue, from, to, page, limit, sortOrder);
        let orderList = [];
        for (let order of orders) {
            const orderStatus = await orderStatusModel.getOrderStatusById(order.id);
            let status = await orderStatusController.getOrderStatus(orderStatus);
            let action = await orderStatusController.getAction(orderStatus);
            let od = {
                id: order.id,
                sender: order.SenderID,
                receiver: order.ReceiverID,
                senderTransactionId: order.SenderTransactionAreaID,
                receiverTransactionId: order.ReceiverTransactionAreaID,
                senderAddress: order.SenderAddress,
                receiverAddress: order.ReceiverAddress,
                arriveAt: order.ArriveAt,
                orderType: order.OrderType,
                orderInfo: JSON.parse(order.OrderInfo),
                price: JSON.parse(order.Price),
                attachedFile: order.AttachedFile,
                weight: order.Weight,
                shippingCost: order.ShippingCost,
                othersCost: order.OthersCost,
                notes: order.Notes,
                status,
                action
            };

            const senderTransaction = od.senderTransactionId;
            const senderTrans = await transactionModel.getTransactionById(senderTransaction);
            const senderGathering = senderTrans.gatheringId;
            const senderGather = await gatheringModel.getGatheringById(senderGathering);

            const receiverTransaction = od.receiverTransactionId;
            const receiverTrans = await transactionModel.getTransactionById(receiverTransaction);
            const receiverGathering = receiverTrans.gatheringId;
            const receiverGather = await gatheringModel.getGatheringById(receiverGathering);

            let arriving = [], processing = [], departed = [], returned = [], discarded = [];

            const odst = await orderStatusModel.getOrderStatusById(od.id);
            if (transaction == receiverTransaction) {
                if (odst.time_return_trans2) returned.push(od);
                else if (odst.time_ship) departed.push(od);
                else if (odst.time_send_trans2) processing.push(od);
                else if (odst.time_leave_s_gather2) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
            }
            if (transaction == receiverGathering) {
                if (odst.time_leave_r_gather2) departed.push(od);
                else if (odst.time_return_gather2) {
                    od.destination = senderGather.name;
                    processing.push(od);
                }
                else if (odst.time_leave_r_trans2) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
                else if (odst.time_leave_s_gather2) departed.push(od);
                else if (odst.time_send_gather2) processing.push(od);
                else if (odst.time_leave_s_gather1) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
            }
            if (transaction == senderGathering) {
                if (odst.time_leave_r_gather1) departed.push(od);
                else if (odst.time_return_gather1) processing.push(od);
                else if (odst.time_leave_r_gather2) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
                else if (odst.time_leave_s_gather1) departed.push(od);
                else if (odst.time_send_gather1) processing.push(od);
                else if (odst.time_leave_s_trans1) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
            }
            if (transaction == senderTransaction) {
                if (odst.time_destroy) discarded.push(od);
                else if (odst.time_ship_back) departed.push(od);
                else if (odst.time_return_trans1) processing.push(od);
                else if (odst.time_leave_r_gather1) {
                    if (req.session.user.role != 'leader') {
                        od.action = {
                            type: 'accept',
                            successAction: `/order/acceptOrder/${od.id}`
                        };
                    }
                    arriving.push(od);
                }
                else if (odst.time_leave_s_trans1) departed.push(od);
                else if (odst.time_send_trans1) processing.push(od);
            }

            if (filter.includes('Arriving')) orderList = [...orderList, ...arriving];
            if (filter.includes('Processing')) orderList = [...orderList, ...processing];
            if (filter.includes('Departed')) orderList = [...orderList, ...departed];
            if (filter.includes('Returned')) orderList = [...orderList, ...returned];
            if (filter.includes('Discarded')) orderList = [...orderList, ...discarded];
        }
        res.status(200).json(Array.from(new Set(orderList)));
    }

    async searchOrderStatus(req, res, next) {
        if (!req.query.id) {
            res.status(400).json({ message: 'order id is required' });
            return;
        }
        const id = req.query.id;
        
        const orderStatus = await orderStatusModel.getOrderStatusById(id);
        if (!orderStatus) {
            res.status(404).json({ message: 'order not found' });
            return;
        }
        let status = await orderStatusController.getOrderStatus(orderStatus);
        res.status(200).json(status);
    }
}

module.exports = new SearchController;