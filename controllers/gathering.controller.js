const accountModel = require('../models/account.model');
const gatheringModel = require('../models/gathering.model');
const cityModel = require('../models/city.model');
const districtModel = require('../models/district.model');

class GatheringController {
    async getGathering(req, res, next) {
        const param = {};

        if (req.session.user.role === 'leader') {
            if (req.query.id && !/^TK\d{4}$/.test(req.query.id)) {
                res.status(200).json([]);
                return;
            } else {
                req.query.id ? param.id = req.query.id : null;
            }
        } else {
            param.id = req.session.user.gathering;
        }

        req.query.name ? param.name = req.query.name : null;

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

        req.query.address ? param.address = req.query.address : null;
        req.query.coordinatesX ? param.coordinateX = req.query.coordinatesX : null;
        req.query.coordinatesY ? param.coordinateY = req.query.coordinatesY : null;
        req.query.manager ? param.Manager = req.query.manager : null;

        const page = req.query.page ? req.query.page : 1;
        const gatherings = await gatheringModel.getGathering(param, page);
        let gatheringList = [];
        for (let gathering of gatherings) {
            gatheringList.push({
                id: gathering.id,
                name: gathering.name,
                city: gathering.CityName,
                district: gathering.DistrictName,
                cityId: gathering.CityID,
                districtId: gathering.DistrictID,
                address: gathering.address,
                coordinatesX: gathering.coordinateX,
                coordinatesY: gathering.coordinateY,
                manager: gathering.manager,
            });
        }
        res.status(200).json(gatheringList);
    }

    async createGathering(req, res, next) {
        let lastGatheringId = await gatheringModel.getLastGatheringId();
        if (lastGatheringId === 'TK9999') {
            res.status(201).json({ message: 'da tao toi da diem tk' });
            return;
        }
        let newGatheringId = 'TK' + String(parseInt(lastGatheringId.substring(2)) + 1).padStart(4, '0');
        const param = {};
        param.id = newGatheringId;
        req.body.name ? param.name = req.body.name : null;
        if (req.body.city) {
            const city = await cityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            param.CityID = city.id;
        }
        if (req.body.district) {
            const district = await districtModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            param.DistrictID = district.id;
        }
        req.body.address ? param.address = req.body.address : null;
        req.body.coordinatesX ? param.coordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? param.coordinateY = req.body.coordinatesY : null;
        if (req.body.manager) {
            const manager = await accountModel.getAccountByUsername(req.body.manager);
            if (!manager || manager.role != 'dean_gather') {
                res.status(400).json({ message: 'manager unknown' });
                return;
            }
            if (manager.transaction) {
                await gatheringModel.updateGathering(
                    { manager: null },
                    { id: manager.transaction }
                );
            }
            param.Manager = manager.username
            await accountModel.updateAccount(
                { transaction: newGatheringId },
                { username: manager.username }
            );
        }

        await gatheringModel.createGathering(param);
        res.status(201).json({ message: 'Success' });
    }

    async updateGathering(req, res, next) {
        const update = {};

        req.body.name ? update.name = req.body.name : null;
        if (req.body.city) {
            const city = await cityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            update.CityID = city.id;
        }

        if (req.body.district) {
            const district = await districtModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            update.DistrictID = district.id;
        }

        req.body.address ? update.address = req.body.address : null;
        req.body.coordinatesX ? update.coordinateX = req.body.coordinatesX : null;
        req.body.coordinatesY ? update.coordinateY = req.body.coordinatesY : null;
        
        if (req.body.manager) {
            if (!req.query.id) {
                res.status(400).json({ message: 'gathering unknown' });
                return;
            }
            const gathering = await gatheringModel.getGatheringById(req.query.id);
            if (!gathering) {
                res.status(400).json({ message: 'gathering unknown' });
                return;
            }
            const manager = await accountModel.getAccountByUsername(req.body.manager);
            if (!manager || manager.role != 'dean_gather') {
                res.status(400).json({ message: 'manager unknown' });
                return;
            }
            if (manager.transaction) {
                await gatheringModel.updateGathering(
                    { manager: null },
                    { id: manager.transaction }
                );
            }
            update.Manager = manager.username
            await accountModel.updateAccount(
                { transaction: req.query.id },
                { username: manager.username }
            );
        }

        if (Object.keys(update).length == 0) {
            res.status(400).json({ message: 'unknown update' });
            return;
        }

        const condition = {};

        req.query.id ? condition.id = req.query.id : null;
        req.query.name ? condition.name = req.query.name : null;

        if (req.query.city) {
            const city = await cityModel.getCityById(req.body.city);
            if (!city) {
                res.status(400).json({ message: 'city id unknown' });
                return;
            }
            condition.CityID = city.id;
        }

        if (req.query.district) {
            const district = await districtModel.getDistrictById(req.body.district);
            if (!district) {
                res.status(400).json({ message: 'district id unknown' });
                return;
            }
            condition.DistrictID = district.id;
        }

        req.query.address ? condition.address = req.query.address : null;
        req.query.coordinatesX ? condition.coordinateX = req.query.coordinatesX : null;
        req.query.coordinatesY ? condition.coordinateY = req.query.coordinatesY : null;
        req.query.manager ? condition.Manager = req.query.manager : null;

        await gatheringModel.updateGathering(update, condition);
        res.status(201).json({ message: 'Success' });
    }

    async deleteGathering(req, res, next) {
        if (!req.query.id) {
            res.status(400).json({ message: 'unknown delete' });
            return;
        }
        await gatheringModel.deleteGathering(req.query.id);
        res.status(200).json({ message: 'Success' });
    }
}

module.exports = new GatheringController;
