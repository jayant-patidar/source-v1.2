"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.protect, notification_controller_1.getNotifications);
router.put('/:id/read', auth_middleware_1.protect, notification_controller_1.markAsRead);
router.put('/read-all', auth_middleware_1.protect, notification_controller_1.markAllAsRead);
exports.default = router;
