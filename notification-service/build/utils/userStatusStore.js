"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusStore = void 0;
class UserStatusStore {
    constructor() {
        this.userStatuses = {};
    }
    static getInstance() {
        if (!UserStatusStore.instance) {
            UserStatusStore.instance = new UserStatusStore();
        }
        return UserStatusStore.instance;
    }
    setUserOnline(userId) {
        this.userStatuses[userId] = true;
    }
    setUserOffline(userId) {
        this.userStatuses[userId] = false;
    }
    isUserOnline(userId) {
        return !!this.userStatuses[userId];
    }
}
exports.UserStatusStore = UserStatusStore;
