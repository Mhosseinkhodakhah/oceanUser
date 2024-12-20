"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = __importDefault(require("./controllers"));
const validators_1 = require("./validators");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const controller = new controllers_1.default();
// const rabbit = new messanger().connect()
const router = (0, express_1.Router)();
const middleware = new middleware_1.default();
const adminAuth = new middleware_1.default().adminAuth;
router.post('/register', validators_1.registerRole, controller.register);
router.get('/test', (req, res, next) => {
    res.status(200).send('test passed');
});
router.post('/login', validators_1.loginRule, controller.login);
router.patch('/update', middleware.auth, controller.updateUser);
router.put('/forget-password', validators_1.forgetRole, controller.forgetPassword);
router.put('/check-code/:email/:code', controller.checkCode);
router.put('/reset-password', validators_1.resetRole, middleware.auth, controller.resetPassword);
exports.default = router;
