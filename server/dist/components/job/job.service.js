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
const job_dal_1 = __importDefault(require("./job.dal"));
class JobService {
    constructor() {
        this.jobDAL = new job_dal_1.default();
    }
    createJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add any specific validation or logic here
            return yield this.jobDAL.createJob(jobData);
        });
    }
    getAllJobs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            // Keyword Search (Title or Description)
            if (query.keyword) {
                filter.$or = [
                    { title: { $regex: query.keyword, $options: 'i' } },
                    { description: { $regex: query.keyword, $options: 'i' } }
                ];
            }
            // Category Filter
            if (query.category && query.category !== 'All') {
                filter.category = query.category;
            }
            // Pay Range Filter
            if (query.minPay || query.maxPay) {
                filter.originalPay = {};
                if (query.minPay)
                    filter.originalPay.$gte = Number(query.minPay);
                if (query.maxPay)
                    filter.originalPay.$lte = Number(query.maxPay);
            }
            // Job Type Filter
            if (query.type && query.type !== 'all') {
                filter.type = query.type; // 'hourly' or 'fixed-price' (mapped from frontend)
            }
            // Location Filter
            if (query.location) {
                filter['location.general'] = { $regex: query.location, $options: 'i' };
            }
            // Date Posted Filter
            if (query.datePosted) {
                const now = new Date();
                let pastDate = new Date();
                switch (query.datePosted) {
                    case '24h':
                        pastDate.setDate(now.getDate() - 1);
                        break;
                    case '7d':
                        pastDate.setDate(now.getDate() - 7);
                        break;
                    case '30d':
                        pastDate.setDate(now.getDate() - 30);
                        break;
                    default:
                        pastDate = new Date(0); // All time
                }
                if (query.datePosted !== 'all') {
                    filter.createdAt = { $gte: pastDate };
                }
            }
            return yield this.jobDAL.getAllJobs(filter, query.sortBy, query.limit ? Number(query.limit) : undefined);
        });
    }
    getJobsByPoster(seekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobDAL.getJobsByPoster(seekerId);
        });
    }
    getJobsByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobDAL.getJobsByProvider(providerId);
        });
    }
    getJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobDAL.getJobById(jobId);
        });
    }
    updateJob(jobId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobDAL.updateJob(jobId, updateData);
        });
    }
    deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jobDAL.deleteJob(jobId);
        });
    }
}
exports.default = JobService;
