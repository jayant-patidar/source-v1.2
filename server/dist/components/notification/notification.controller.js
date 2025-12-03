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
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("./notification.model"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_model_1.default.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name avatar')
            .populate('job', 'title');
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});
exports.getNotifications = getNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_model_1.default.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});
exports.markAsRead = markAsRead;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notification_model_1.default.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
        res.json({ message: 'All marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notifications' });
    }
});
exports.markAllAsRead = markAllAsRead;
