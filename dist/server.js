"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston")); // this packages for logging the requests
const express_winston_1 = __importDefault(require("express-winston")); // logger
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize")); // for prevent of injection query in database
const helmet_1 = __importDefault(require("helmet")); // security
const hpp_1 = __importDefault(require("hpp")); // security
const cors_1 = __importDefault(require("cors")); // security
const winston_2 = require("winston");
const router_1 = __importDefault(require("./userModule/router"));
const connection_1 = __importDefault(require("./DB/connection"));
const router_2 = __importDefault(require("./interservice/router"));
const router_3 = __importDefault(require("./admin/router"));
const { combine, timestamp, label, prettyPrint } = winston_2.format;
dotenv_1.default.config({ path: './config/config.env' }); // config file
// configuration app 
const app = (0, express_1.default)();
// Sanitize data
app.use((0, express_mongo_sanitize_1.default)());
(0, connection_1.default)();
// securing connection 
app.use((0, helmet_1.default)()); // Set security headers
// app.use(xss()); // Prevent XSS attacks
app.use((0, hpp_1.default)());
app.use((0, cors_1.default)());
//set logger
app.use(express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console(), new (winston_1.default.transports.File)({ filename: 'myLogs.log' })],
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
        return false;
    },
}));
// inside logger!!!!
winston_1.default.configure({
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    transports: [
        new (winston_1.default.transports.File)({ filename: 'inside.log' }),
        // new winston.transports.Console()
    ],
});
app.use(express_1.default.json({ limit: "25mb" }));
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('server is running successfully . . .');
});
app.use('/app', router_1.default);
app.use('/interservice', router_2.default);
app.use('/', router_3.default);
