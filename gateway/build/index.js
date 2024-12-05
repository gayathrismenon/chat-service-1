"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const auth = (0, express_http_proxy_1.default)("http://localhost:8081");
const messages = (0, express_http_proxy_1.default)("http://localhost:8082");
const notifications = (0, express_http_proxy_1.default)("http://localhost:8084");
app.use("/api/auth", auth);
app.use("/api/messages", messages);
app.use("/api/notifications", notifications);
const server = app.listen(8080, () => {
    console.log("Gateway is Listening to Port 8080");
});
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
