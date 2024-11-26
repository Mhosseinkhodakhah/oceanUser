"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cach_1 = __importDefault(require("../cache/cach"));
const pints_1 = __importDefault(require("../DB/models/pints"));
const user_1 = __importDefault(require("../DB/models/user"));
const response_1 = require("../response");
class adminController {
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachData = yield cach_1.default.getter('admin-getAllUsers');
            let finalData;
            if (cachData) {
                finalData = cachData;
            }
            else {
                const users = yield user_1.default.find();
                finalData = users;
                yield cach_1.default.setter('admin-getAllUsers', users);
            }
            return next(new response_1.response(req, res, 'get all users by admin', 200, null, finalData));
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachData = yield cach_1.default.getter(`admin-getUser-${req.params.userId}`);
            let finalData;
            if (cachData) {
                finalData = cachData;
            }
            else {
                const user = yield user_1.default.findById(req.params.userId);
                if (user) {
                    yield cach_1.default.setter(`admin-getUser-${req.params.userId}`, user);
                    finalData = user;
                }
                else {
                    return next(new response_1.response(req, res, 'get specific user', 404, 'this user is not exist on database', null));
                }
            }
            return next(new response_1.response(req, res, 'get specific user', 200, null, finalData));
        });
    }
    getRegionUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachData = yield cach_1.default.getter(`admin-getRegionUser`);
            let finalData;
            if (cachData) {
                finalData = cachData;
            }
            else {
                const iranianUser = yield user_1.default.find({ country: 'iran' });
                const englandUser = yield user_1.default.find({ country: 'english' });
                const uae = yield user_1.default.find({ country: 'uae' });
                finalData = { iran: iranianUser.length, english: englandUser.length, arabestan: uae.length };
                yield cach_1.default.setter('admin-getRegionUser', finalData);
            }
            return next(new response_1.response(req, res, 'get users based on region', 200, null, finalData));
        });
    }
    getUserPoints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachData = yield cach_1.default.getter(`admin-getUserPoints`);
            let finalData;
            if (cachData) {
                finalData = cachData;
            }
            else {
                const pointsRank = yield pints_1.default.find().populate('user').sort({ 'points': 1 });
                finalData = pointsRank;
                yield cach_1.default.setter('admin-getUserPoints', pointsRank);
            }
            return next(new response_1.response(req, res, 'get users based on points', 200, null, finalData));
        });
    }
}
exports.default = adminController;
