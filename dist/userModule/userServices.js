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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class userService {
    tokenize(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign(data, `${process.env.ACCESSKEY}`, { expiresIn: '1H' });
            return token;
        });
    }
    refreshTokenize(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign(data, `${process.env.ACCESSREFRESHKEY}`, { expiresIn: '168H' });
            return token;
        });
    }
    hashPass(pass) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'hash';
        });
    }
    checkToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, `${process.env.ACCESSKEY}`);
                return decoded;
            }
            catch (error) {
                return false;
            }
        });
    }
    checkRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, `${process.env.ACCESSREFRESHKEY}`);
                return decoded;
            }
            catch (error) {
                return false;
            }
        });
    }
    getHtml(userName, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return `<!DOCTYPE html>
   <html>
    <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
        <title>otp code for reseting password</title>
    </head>
    <body class="container-fluid justify-content-center">
        <div class="container-fluid justify-content-center">
        <div class="card text-center">
            <div  class="card-header" style=" height:60px; text-align : center; background-color: rgba(0, 190, 190, 0.316);">
                پژوهشکده ملی اقیانوس شناسی و علوم جوی جمهوری اسلامی ایران
            </div>
            <div class="card-body">
              <h5 style="text-align : center;" class="card-title">reseting password</h5>
              <p style="text-align : center;" class="card-text">please use this code and go back to application and send this code . . .</p>
                <p style="text-align : center;" class="card-text text-center"><b>Your code is:</b></p>
                <h5 style="text-align : center;" class="card-title text-center">${code}</h5>
              <br>
              <p style="text-align : center;" class="card-text">this email send for reseting your application password</p>
              <p style="text-align : center;" class="card-text">If you have not requested this email, please ignore it</p>
            </div>
            <div class="card-footer text-body-secondary">
                <h6 style="text-align: center;">پژوهشکده ملی اقیانوس شناسی <span class="badge text-bg-secondary">inio.ac.ir</span></h6> 
            </div>
          </div>
    </div>
    </body>
   </html>`;
        });
    }
    sendEmail(email, code, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'kianlucifer0098@gmail.com',
                    pass: 'cnno pezo wooi qkpl',
                },
            });
            transporter.verify().then(console.log).catch(console.error);
            try {
                const resault = yield transporter.sendMail({
                    from: 'پژوهشکده ملی اقیانوس شناسی و علوم جوی', // sender address
                    to: `${email}`, // list of receivers
                    subject: "forget password", // Subject line
                    text: "لطفا کد زیر را وارد کنید و در اپلیکیشن وارد کنید", // plain text body
                    html: yield this.getHtml(userName, code), // html body
                });
                return resault;
            }
            catch (error) {
                return false;
            }
        });
    }
    codeGenerator() {
        return __awaiter(this, void 0, void 0, function* () {
            // const code = uuidv4()
            const number = Math.random();
            let code;
            if (number < 0.1) {
                code = Math.floor(number * 100000);
            }
            else {
                code = Math.floor(number * 10000);
            }
            return code.toString();
        });
    }
}
exports.default = userService;
