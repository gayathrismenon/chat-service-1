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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../config/config"));
const jwtSecret = config_1.default.JWT_SECRET;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userExists = yield database_1.User.findOne({ email });
        if (userExists) {
            throw new utils_1.ApiError(400, "User already exists!");
        }
        const user = yield database_1.User.create({
            name,
            email,
            password: yield (0, utils_1.encryptPassword)(password),
        });
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        res.json({
            status: 200,
            message: "User registered successfully!",
            data: userData,
        });
    }
    catch (error) {
        res.json({
            status: 500,
            message: error.message,
        });
    }
});
exports.register = register;
const createSendToken = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, id } = user;
    const token = jsonwebtoken_1.default.sign({ name, email, id }, jwtSecret, {
        expiresIn: "1d",
    });
    if (config_1.default.env === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    return token;
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield database_1.User.findOne({ email }).select("+password");
        if (!user ||
            !(yield (0, utils_1.isPasswordMatch)(password, user.password))) {
            throw new utils_1.ApiError(400, "Incorrect email or password");
        }
        const token = yield createSendToken(user, res);
        res.json({
            status: 200,
            message: "User logged in successfully!",
            token,
        });
    }
    catch (error) {
        res.json({
            status: 500,
            message: error.message,
        });
    }
});
exports.login = login;
