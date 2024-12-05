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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const database_1 = require("../database");
const utils_1 = require("../utils");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const profile = yield database_1.UserProfile.findById(userId);
        if (!profile) {
            throw new utils_1.ApiError(404, "User profile not found");
        }
        res.json({
            status: 200,
            message: "Profile retrieved successfully!",
            data: profile
        });
    }
    catch (error) {
        res.json({
            status: error instanceof utils_1.ApiError ? error.statusCode : 500,
            message: error.message
        });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const updatedProfile = req.body;
        const profile = yield database_1.UserProfile.findByIdAndUpdate(userId, updatedProfile, { new: true });
        if (!profile) {
            throw new utils_1.ApiError(404, "User profile not found");
        }
        res.json({
            status: 200,
            message: "Profile updated successfully!",
            data: profile
        });
    }
    catch (error) {
        res.json({
            status: error instanceof utils_1.ApiError ? error.statusCode : 500,
            message: error.message
        });
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { currentPassword, newPassword } = req.body;
        const user = yield database_1.UserProfile.findById(userId);
        if (!user) {
            throw new utils_1.ApiError(404, "User not found");
        }
        // Add password verification logic
        const isPasswordValid = user.password === currentPassword;
        if (!isPasswordValid) {
            throw new utils_1.ApiError(401, "Current password is incorrect");
        }
        user.password = newPassword;
        yield user.save();
        res.json({
            status: 200,
            message: "Password updated successfully!"
        });
    }
    catch (error) {
        res.json({
            status: error instanceof utils_1.ApiError ? error.statusCode : 500,
            message: error.message
        });
    }
});
exports.changePassword = changePassword;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const deletedProfile = yield database_1.UserProfile.findByIdAndDelete(userId);
        if (!deletedProfile) {
            throw new utils_1.ApiError(404, "User profile not found");
        }
        res.json({
            status: 200,
            message: "Account deleted successfully!"
        });
    }
    catch (error) {
        res.json({
            status: error instanceof utils_1.ApiError ? error.statusCode : 500,
            message: error.message
        });
    }
});
exports.deleteAccount = deleteAccount;
// export default {
//   getProfile,
//   updateProfile,
//   changePassword,
//   deleteAccount
// };
