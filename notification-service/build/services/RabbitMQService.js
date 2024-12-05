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
exports.EmailService = exports.FCMService = exports.rabbitMQService = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = __importDefault(require("../config/config"));
const FCMService_1 = require("./FCMService");
Object.defineProperty(exports, "FCMService", { enumerable: true, get: function () { return FCMService_1.FCMService; } });
const EmailService_1 = require("./EmailService");
Object.defineProperty(exports, "EmailService", { enumerable: true, get: function () { return EmailService_1.EmailService; } });
const utils_1 = require("../utils");
class RabbitMQService {
    constructor() {
        this.fcmService = new FCMService_1.FCMService();
        this.emailService = new EmailService_1.EmailService();
        this.userStatusStore = new utils_1.UserStatusStore();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield amqplib_1.default.connect(config_1.default.msgBrokerURL);
            this.channel = yield connection.createChannel();
            yield this.consumeNotification();
        });
    }
    consumeNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.assertQueue(config_1.default.queue.notifications);
            this.channel.consume(config_1.default.queue.notifications, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg) {
                    const { type, userId, message, userEmail, userToken, fromName, } = JSON.parse(msg.content.toString());
                    if (type === "MESSAGE_RECEIVED") {
                        // Check if the user is online
                        const isUserOnline = this.userStatusStore.isUserOnline(userId);
                        if (isUserOnline && userToken) {
                            // User is online, send a push notification
                            yield this.fcmService.sendPushNotification(userToken, message);
                        }
                        else if (userEmail) {
                            // User is offline, send an email
                            yield this.emailService.sendEmail(userEmail, `New Message from ${fromName}`, message);
                        }
                    }
                    this.channel.ack(msg); // Acknowledge the message after processing
                }
            }));
        });
    }
}
exports.rabbitMQService = new RabbitMQService();
