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
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../DB/models/user"));
const response_1 = require("../response");
const userServices_1 = __importDefault(require("./userServices"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pints_1 = __importDefault(require("../DB/models/pints"));
const connection_1 = __importDefault(require("../interservice/connection"));
const services = new userServices_1.default();
const connection = new connection_1.default();
class userControlers {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const error = (0, express_validator_1.validationResult)(req);
            if (!error.isEmpty()) {
                return next(new response_1.response(req, res, 'register', 400, error['errors'][0].msg, null));
            }
            const exist = yield user_1.default.exists({ email: req.body.email });
            if (exist) {
                return next(new response_1.response(req, res, 'register', 401, 'this email already has been used', null));
            }
            const hash = yield bcrypt_1.default.hash(req.body.password, 10);
            body.password = hash;
            // body['']
            const user = yield user_1.default.create(body);
            const point = yield pints_1.default.create({ user: user._id });
            yield user_1.default.findByIdAndUpdate(user._id, { points: point._id });
            const data = {
                id: (user._id).toString(),
                email: body.email,
                fullName: body.fullName,
                country: body.country,
                language: body.language
            };
            const token = yield services.tokenize(data);
            console.log(token);
            const refreshToken = yield services.refreshTokenize({ email: data.email });
            const newData = Object.assign(Object.assign({}, data), { token: token, refreshToken: refreshToken });
            yield connection.resetCache();
            let userLog = {
                user: {
                    userName: user.userName,
                    fullName: user.fullName,
                    profile: user.profile,
                },
                title: `registeration`,
                description: `user ${req.body.email} registered successfully!`
            };
            yield connection.putNewLog(userLog);
            return next(new response_1.response(req, res, 'register', 200, null, { user: newData }));
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('here1');
            const existance = yield user_1.default.exists({ email: req.body.email });
            if (!existance) {
                // return res.status(200).json('this user is not exist')
                return next(new response_1.response(req, res, 'login', 401, 'this email is not exist on databse', null));
            }
            console.log('here2');
            const user = yield user_1.default.findOne({ email: req.body.email });
            if (user) {
                console.log('here3');
                const password = user === null || user === void 0 ? void 0 : user.password;
                const compare = yield bcrypt_1.default.compare(req.body.password, password);
                console.log(compare);
                if (!compare) {
                    let userLog = {
                        user: {
                            userName: user.userName,
                            fullName: user.fullName,
                            profile: user.profile,
                        },
                        title: `login`,
                        description: `user ${user.email} tryed to logging in but his password was incorrect !`
                    };
                    yield connection.putNewLog(userLog);
                    return next(new response_1.response(req, res, 'login', 401, 'the password is incorrect', null));
                }
                const data = {
                    id: (user === null || user === void 0 ? void 0 : user._id),
                    email: user === null || user === void 0 ? void 0 : user.email,
                    userName: user === null || user === void 0 ? void 0 : user.userName,
                    profile: user === null || user === void 0 ? void 0 : user.profile,
                    fullName: user === null || user === void 0 ? void 0 : user.fullName,
                    country: user === null || user === void 0 ? void 0 : user.country,
                    language: user === null || user === void 0 ? void 0 : user.language,
                    school: user === null || user === void 0 ? void 0 : user.school
                };
                const token = yield services.tokenize(data);
                const refreshToken = yield services.refreshTokenize({ email: data.email });
                const newData = Object.assign(Object.assign({}, data), { token: token, refreshToken: refreshToken });
                let userLog = {
                    user: {
                        userName: user.userName,
                        fullName: user.fullName,
                        profile: user.profile,
                    },
                    title: `login`,
                    description: `user ${user.email} loged in successfully!`
                };
                yield connection.putNewLog(userLog);
                return next(new response_1.response(req, res, 'login', 200, null, { user: newData }));
            }
        });
    }
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(req.user.id);
            return next(new response_1.response(req, res, 'check token', 200, null, { user: user }));
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(req.user.id);
            if (!user) {
                return next(new response_1.response(req, res, 'update', 404, 'user is not exist on database', null));
            }
            const newData = Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.toObject()), req.body);
            yield (user === null || user === void 0 ? void 0 : user.updateOne(newData));
            const updated = yield user_1.default.findById(req.user.id).populate({ path: 'points', select: ['points', 'pointsLogs'] }).select(['-password', '-resetPasswordToken']);
            yield connection.resetCache();
            let userLog = {
                user: {
                    userName: user.userName,
                    fullName: user.fullName,
                    profile: user.profile,
                },
                title: `update profile`,
                description: `user ${user.email} update the profile successfully!`
            };
            yield connection.putNewLog(userLog);
            return next(new response_1.response(req, res, 'update user', 200, null, { user: updated }));
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = req.body;
            const bodyError = (0, express_validator_1.validationResult)(req);
            if (!bodyError.isEmpty()) {
                return next(new response_1.response(req, res, 'refresh token', 400, bodyError['errors'][0].msg, null));
            }
            console.log(req.body);
            const verify = yield services.checkRefreshToken(req.body.refreshToken);
            // console.log(verify)
            if (!verify) {
                return next(new response_1.response(req, res, 'refresh token', 401, 'token expired', null));
            }
            const user = yield user_1.default.findOne({ email: verify.email });
            const data = {
                id: (_a = (user === null || user === void 0 ? void 0 : user._id)) === null || _a === void 0 ? void 0 : _a.toString(),
                email: user === null || user === void 0 ? void 0 : user.email,
                fullName: user === null || user === void 0 ? void 0 : user.fullName,
                country: user === null || user === void 0 ? void 0 : user.country,
                language: user === null || user === void 0 ? void 0 : user.language
            };
            const token = yield services.tokenize(data);
            const newData = Object.assign(Object.assign({}, data), { token: token });
            return next(new response_1.response(req, res, 'refresh token', 200, null, { user: newData }));
        });
    }
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyError = (0, express_validator_1.validationResult)(req);
            if (!bodyError.isEmpty()) {
                return next(new response_1.response(req, res, 'forget password', 400, bodyError['errors'][0].msg, null));
            }
            const { email } = req.body;
            const user = yield user_1.default.findOne({ email: email });
            // if (!user){
            //     return next(new response(req, res, 'forget password', 403, 'no account found for this email', null))
            // }
            const code = yield services.codeGenerator();
            const sendEmail = yield services.sendEmail(email, code, 'hossein');
            console.log('1111');
            yield user_1.default.findOneAndUpdate({ email: email }, { resetPasswordToken: code });
            console.log('2222');
            return next(new response_1.response(req, res, 'forget password', 200, null, 'the code send to your email successfully! please check your email.'));
        });
    }
    checkCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.params.code;
            const email = req.params.email;
            const user = yield user_1.default.findOne({ email: email }).select('-password');
            if (!user) {
                return next(new response_1.response(req, res, 'check otp code!', 403, 'email not found!', null));
            }
            if (user.resetPasswordToken !== code) {
                return next(new response_1.response(req, res, 'check otp code!', 403, 'wrong code!', null));
            }
            const data = {
                id: (user._id).toString(),
                email: user === null || user === void 0 ? void 0 : user.email,
                fullName: user === null || user === void 0 ? void 0 : user.fullName,
                country: user === null || user === void 0 ? void 0 : user.country,
                language: user === null || user === void 0 ? void 0 : user.language
            };
            const token = yield services.tokenize(data);
            const newData = Object.assign(Object.assign({}, data), { token: token });
            return next(new response_1.response(req, res, 'check otp code!', 200, null, { user: newData }));
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyError = (0, express_validator_1.validationResult)(req);
            if (!bodyError.isEmpty()) {
                return next(new response_1.response(req, res, 'reset password', 400, bodyError['errors'][0].msg, null));
            }
            const user = yield user_1.default.findById(req.user.id);
            if (!user) {
                return next(new response_1.response(req, res, 'reset password', 404, 'this user is not exist on database', null));
            }
            const hash = yield bcrypt_1.default.hash(req.body.password, 10);
            console.log('hashhhhh >>>>>', hash);
            yield user_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { password: hash });
            let userLog = {
                user: {
                    userName: user.userName,
                    fullName: user.fullName,
                    profile: user.profile,
                },
                title: `resetPassword`,
                description: `user ${user.email} resetPassword successfully!`
            };
            yield connection.putNewLog(userLog);
            return next(new response_1.response(req, res, 'reset password', 200, null, 'the password successfully updated!'));
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(req.user.id).populate('points').select(['-password', '-resetPasswordToken']);
            return next(new response_1.response(req, res, 'get user', 200, null, { user: user }));
        });
    }
    getRankPoints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const points = yield pints_1.default.find().sort({ 'points': -1 }).populate('user', 'userName fullName email country');
            console.log('point', points);
            return next(new response_1.response(req, res, 'get user point', 200, null, { points: points }));
        });
    }
    getUserPoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const point = yield user_1.default.findById(req.user.id);
            return next(new response_1.response(req, res, 'get user point', 200, null, point === null || point === void 0 ? void 0 : point.points));
        });
    }
}
exports.default = userControlers;
