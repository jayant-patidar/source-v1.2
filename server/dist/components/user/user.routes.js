"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// Auth Routes
router.post('/register', user_controller_1.default.createUser.bind(user_controller_1.default));
router.post('/login', user_controller_1.default.loginUser.bind(user_controller_1.default));
router.post('/logout', user_controller_1.default.logoutUser.bind(user_controller_1.default));
router.post('/refresh', user_controller_1.default.refreshToken.bind(user_controller_1.default));
router.get('/profile', auth_middleware_1.protect, user_controller_1.default.getUserProfile.bind(user_controller_1.default));
router.put('/profile', auth_middleware_1.protect, user_controller_1.default.updateUserProfile.bind(user_controller_1.default));
router.post('/saved/:jobId', auth_middleware_1.protect, user_controller_1.default.toggleSavedJob.bind(user_controller_1.default));
router.get('/saved', auth_middleware_1.protect, user_controller_1.default.getSavedJobs.bind(user_controller_1.default));
// User Management Routes
router.get('/', auth_middleware_1.protect, user_controller_1.default.getAllUsers.bind(user_controller_1.default));
router.get('/:id', auth_middleware_1.protect, user_controller_1.default.getPublicUserById.bind(user_controller_1.default));
exports.default = router;
