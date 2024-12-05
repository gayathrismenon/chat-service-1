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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.default.smtp.host,
            port: config_1.default.smtp.port,
            secure: false,
            auth: {
                user: config_1.default.smtp.user,
                pass: config_1.default.smtp.pass,
            },
        });
    }
    sendEmail(to, subject, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: config_1.default.EMAIL_FROM,
                to: to,
                subject: subject,
                html: content,
            };
            try {
                const info = yield this.transporter.sendMail(mailOptions);
                console.log("Email sent: %s", info.messageId);
            }
            catch (error) {
                console.error("Error sending email:", error);
            }
        });
    }
}
exports.EmailService = EmailService;
