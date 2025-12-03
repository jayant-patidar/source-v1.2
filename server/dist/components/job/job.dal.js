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
const job_model_1 = __importDefault(require("./job.model"));
class JobDAL {
    createJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newJob = new job_model_1.default(jobData);
            return yield newJob.save();
        });
    }
    getAllJobs() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, sortBy = 'newest', limit) {
            let sortOptions = { createdAt: -1 }; // Default: Newest
            if (sortBy === 'oldest') {
                sortOptions = { createdAt: 1 };
            }
            else if (sortBy === 'payHigh') {
                sortOptions = { originalPay: -1 };
            }
            else if (sortBy === 'payLow') {
                sortOptions = { originalPay: 1 };
            }
            let query = job_model_1.default.find(filter)
                .populate('seekerId', 'name email seekerRating providerRating avatar')
                .populate('providerId', 'name email seekerRating providerRating avatar')
                .sort(sortOptions);
            if (limit) {
                query = query.limit(limit);
            }
            return yield query;
        });
    }
    getJobsByPoster(seekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_model_1.default.find({ seekerId }).sort({ createdAt: -1 }).populate('providerId', 'name');
        });
    }
    getJobsByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_model_1.default.find({ providerId }).sort({ createdAt: -1 }).populate('seekerId', 'name');
        });
    }
    getJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_model_1.default.findById(jobId).populate('seekerId', 'name email seekerRating providerRating avatar').populate('providerId', 'name email seekerRating providerRating avatar');
        });
    }
    updateJob(jobId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_model_1.default.findByIdAndUpdate(jobId, updateData, { new: true });
        });
    }
    deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_model_1.default.findByIdAndDelete(jobId);
        });
    }
}
exports.default = JobDAL;
