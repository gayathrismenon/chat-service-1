"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import  getProfile from '../controllers';
const UserProfile_1 = require("../controllers/UserProfile");
const router = express_1.default.Router();
router.get('/:userId', UserProfile_1.getProfile);
router.patch('/:userId', UserProfile_1.updateProfile);
router.post('/:userId/password', UserProfile_1.changePassword);
router.delete('/:userId', UserProfile_1.deleteAccount);
exports.default = router;
