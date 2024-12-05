"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", AuthController_1.register);
userRouter.post("/login", AuthController_1.login);
exports.default = userRouter;
