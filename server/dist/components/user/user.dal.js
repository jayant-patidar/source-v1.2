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
const user_model_1 = __importDefault(require("./user.model"));
class UserDAL {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_model_1.default(userData);
            return yield newUser.save();
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.find({});
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(userId);
        });
    }
    getUserByIdWithoutPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(userId).select('-password');
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ email });
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        });
    }
    getPublicUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(userId).select('name avatar seekerRating providerRating about skills preferences portfolio socialLinks createdAt');
        });
    }
    toggleSavedJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield user_model_1.default.findById(userId);
            if (!user)
                return null;
            const isSaved = (_a = user.savedJobs) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === jobId);
            if (isSaved) {
                return yield user_model_1.default.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } }, { new: true });
            }
            else {
                return yield user_model_1.default.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobId } }, { new: true });
            }
        });
    }
    getSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userId).populate({
                path: 'savedJobs',
                populate: {
                    path: 'seekerId',
                    select: 'name avatar seekerRating'
                }
            });
            return (user === null || user === void 0 ? void 0 : user.savedJobs) || [];
        });
    }
}
exports.default = UserDAL;
