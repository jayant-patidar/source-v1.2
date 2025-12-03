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
const user_service_1 = __importDefault(require("./user.service"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userService.createUser(req.body);
                if (newUser) {
                    (0, generateToken_1.default)(res, newUser._id.toString());
                    res.status(201).json({
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: 'user' // Default role
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userService.loginUser(email);
                if (user && (yield user.matchPassword(password))) {
                    (0, generateToken_1.default)(res, user._id.toString());
                    res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        seekerRating: user.seekerRating,
                        providerRating: user.providerRating,
                    });
                }
                else {
                    res.status(401);
                    throw new Error('Invalid email or password');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    logoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.cookie('jwt', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            res.cookie('refresh_token', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(200).json({ message: 'Logged out successfully' });
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken) {
                res.status(401);
                throw new Error('Not authorized, no refresh token');
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
                // Generate new access token
                const accessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_SECRET || 'secret', {
                    expiresIn: '15m',
                });
                res.cookie('jwt', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.status(200).json({ message: 'Token refreshed' });
            }
            catch (error) {
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.userService.getAllUsers();
                res.status(200).json(allUsers);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserById(req.params.id);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404).json({ error: 'User not found.' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPublicUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getPublicUserById(req.params.id);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404).json({ error: 'User not found.' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    toggleSavedJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.toggleSavedJob(req.user._id, req.params.jobId);
                res.json(user === null || user === void 0 ? void 0 : user.savedJobs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSavedJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedJobs = yield this.userService.getSavedJobs(req.user._id);
                res.json(savedJobs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserByIdWithoutPassword(req.user._id);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404);
                    throw new Error('User not found');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserById(req.user._id);
                if (user) {
                    // Handle password update
                    if (req.body.currentPassword && req.body.newPassword) {
                        if (yield user.matchPassword(req.body.currentPassword)) {
                            const salt = yield bcryptjs_1.default.genSalt(10);
                            const hashedPassword = yield bcryptjs_1.default.hash(req.body.newPassword, salt);
                            yield this.userService.updateUser(req.user._id, { password: hashedPassword });
                        }
                        else {
                            res.status(401);
                            throw new Error('Invalid current password');
                        }
                    }
                    // Update fields if present in body
                    const updateData = Object.assign({}, req.body);
                    delete updateData.password;
                    delete updateData.currentPassword;
                    delete updateData.newPassword;
                    delete updateData.email;
                    const updatedUser = yield this.userService.updateUser(req.user._id, updateData);
                    res.json(updatedUser);
                }
                else {
                    res.status(404);
                    throw new Error('User not found');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
