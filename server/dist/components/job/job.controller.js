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
                const jobData = Object.assign(Object.assign({}, req.body), { seekerId: req.user._id, originalPay: req.body.pay, currentPay: req.body.pay, location: {
                        general: req.body.generalLocation || ((_a = req.body.location) === null || _a === void 0 ? void 0 : _a.general),
                        exact: req.body.exactLocation || ((_b = req.body.location) === null || _b === void 0 ? void 0 : _b.exact)
                    }, updatedPay: [], 
                    // Ensure tags is an array if it comes as string
                    tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : []), requirements: Array.isArray(req.body.requirements) ? req.body.requirements : (req.body.requirements ? req.body.requirements.split(',').map((r) => r.trim()) : []) });
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
                    console.log('getJobById returning:', JSON.stringify(job));
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
                const jobId = req.params.id;
                const updateData = Object.assign({}, req.body);
                if (updateData.requirements && typeof updateData.requirements === 'string') {
                    updateData.requirements = updateData.requirements.split(',').map((r) => r.trim());
                }
                // Handle Pay Update Logic
                if (updateData.pay) {
                    const existingJob = yield this.jobService.getJobById(jobId);
                    if (existingJob) {
                        const newPay = Number(updateData.pay);
                        // Only update if pay is different
                        if (newPay !== existingJob.currentPay && newPay !== existingJob.originalPay) {
                            // Add old pay to history
                            const oldPay = existingJob.currentPay || existingJob.originalPay;
                            updateData.updatedPay = [
                                ...(existingJob.updatedPay || []),
                                { pay: oldPay, updatedAt: new Date() }
                            ];
                            updateData.currentPay = newPay;
                        }
                        delete updateData.pay; // Remove 'pay' to avoid confusion/overwriting
                    }
                }
                const updatedJob = yield this.jobService.updateJob(jobId, updateData);
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
    startJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const jobId = req.params.id;
                const job = yield this.jobService.getJobById(jobId);
                if (!job) {
                    return res.status(404).json({ error: 'Job not found' });
                }
                // Check if user is seeker or provider
                const isSeeker = job.seekerId.toString() === req.user._id.toString() || ((_a = job.seekerId._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.user._id.toString();
                const isProvider = ((_b = job.providerId) === null || _b === void 0 ? void 0 : _b.toString()) === req.user._id.toString() || ((_d = (_c = job.providerId) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString()) === req.user._id.toString();
                if (!isSeeker && !isProvider) {
                    return res.status(403).json({ error: 'Not authorized to start this job' });
                }
                if (job.status !== 'accepted') {
                    return res.status(400).json({ error: 'Job must be accepted to start' });
                }
                // Update status and startTime
                const updatedJob = yield this.jobService.updateJob(jobId, {
                    status: 'in_progress',
                    startTime: new Date()
                });
                res.status(200).json(updatedJob);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new JobController();
