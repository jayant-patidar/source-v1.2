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
const user_dal_1 = __importDefault(require("./user.dal"));
class UserService {
    constructor() {
        this.userDAL = new user_dal_1.default();
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            const userExists = yield this.userDAL.getUserByEmail(userData.email);
            if (userExists) {
                throw new Error('User already exists');
            }
            return yield this.userDAL.createUser(userData);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getAllUsers();
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getUserById(userId);
        });
    }
    getUserByIdWithoutPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getUserByIdWithoutPassword(userId);
        });
    }
    loginUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getUserByEmail(email);
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.updateUser(userId, updateData);
        });
    }
    getPublicUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getPublicUserById(userId);
        });
    }
    toggleSavedJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.toggleSavedJob(userId, jobId);
        });
    }
    getSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDAL.getSavedJobs(userId);
        });
    }
}
exports.default = UserService;
