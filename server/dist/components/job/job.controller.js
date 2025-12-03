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
const job_service_1 = __importDefault(require("./job.service"));
class JobController {
    constructor() {
        this.jobService = new job_service_1.default();
    }
    createJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const jobData = Object.assign(Object.assign({}, req.body), { seekerId: req.user._id, originalPay: req.body.pay, location: {
                        general: req.body.generalLocation || ((_a = req.body.location) === null || _a === void 0 ? void 0 : _a.general),
                        exact: req.body.exactLocation || ((_b = req.body.location) === null || _b === void 0 ? void 0 : _b.exact)
                    }, updatedPay: [], 
                    // Ensure tags is an array if it comes as string
                    tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : []) });
                console.log('Received Job Body:', req.body);
                console.log('Constructed Job Data:', jobData);
                const newJob = yield this.jobService.createJob(jobData);
                res.status(201).json(newJob);
            }
            catch (error) {
                console.error('Error creating job:', error);
                next(error);
            }
        });
    }
    getAllJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.jobService.getAllJobs(req.query);
                res.status(200).json(jobs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJobsByPoster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.jobService.getJobsByPoster(req.user._id);
                res.status(200).json(jobs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJobsByProvider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.jobService.getJobsByProvider(req.user._id);
                res.status(200).json(jobs);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJobById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield this.jobService.getJobById(req.params.id);
                if (job) {
                    res.status(200).json(job);
                }
                else {
                    res.status(404).json({ error: 'Job not found' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJob = yield this.jobService.updateJob(req.params.id, req.body);
                if (updatedJob) {
                    res.status(200).json(updatedJob);
                }
                else {
                    res.status(404).json({ error: 'Job not found' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedJob = yield this.jobService.deleteJob(req.params.id);
                if (deletedJob) {
                    res.status(200).json({ message: 'Job removed' });
                }
                else {
                    res.status(404).json({ error: 'Job not found' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new JobController();
