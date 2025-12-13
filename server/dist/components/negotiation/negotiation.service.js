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
const mongoose_1 = __importDefault(require("mongoose"));
const negotiation_dal_1 = __importDefault(require("./negotiation.dal"));
const job_dal_1 = __importDefault(require("../job/job.dal"));
class NegotiationService {
    constructor() {
        this.negotiationDAL = new negotiation_dal_1.default();
        this.jobDAL = new job_dal_1.default();
    }
    createNegotiation(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this.jobDAL.getJobById(data.jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            // Check if user is the job poster (provider)
            // In the original controller: if (job.poster.toString() === req.user._id.toString())
            // But wait, the job model has `seekerId` (poster) and `providerId` (worker/applicant)?
            // Let's check Job Model.
            // Job Model: seekerId (required, ref User), providerId (optional, ref User).
            // Usually 'seeker' posts the job looking for a 'provider'.
            // So seekerId is the poster.
            if (job.seekerId.toString() === userId) {
                throw new Error('Cannot negotiate on your own job');
            }
            // Negotiation model mapping:
            // - seeker: The job poster (Service Seeker)
            // - provider: The applicant/worker (Service Provider)
            return yield this.negotiationDAL.createNegotiation({
                job: data.jobId,
                seeker: job.seekerId, // Poster
                provider: userId, // Applicant
                amount: data.amount,
                message: data.message
            });
        });
    }
    getNegotiationsByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.negotiationDAL.getNegotiationsByJobId(jobId);
        });
    }
    getNegotiationsByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.negotiationDAL.getNegotiationsByProvider(providerId);
        });
    }
    getNegotiationsBySeeker(seekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.negotiationDAL.getNegotiationsBySeeker(seekerId);
        });
    }
    updateNegotiationStatus(id, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const negotiation = yield this.negotiationDAL.getNegotiationById(id);
            if (!negotiation) {
                throw new Error('Negotiation not found');
            }
            // Only the Seeker (Job Poster) can accept/reject
            if (negotiation.seeker.toString() !== userId) {
                throw new Error('Not authorized');
            }
            const updatedNegotiation = yield this.negotiationDAL.updateNegotiation(id, { status });
            if (status === 'accepted') {
                console.log('Negotiation accepted. Updating Job:', negotiation.job);
                console.log('Assigning Provider:', negotiation.provider);
                // Update Job status
                const updatedJob = yield this.jobDAL.updateJob(negotiation.job.toString(), {
                    status: 'accepted',
                    providerId: new mongoose_1.default.Types.ObjectId(negotiation.provider.toString()) // Assign the applicant (Provider)
                });
                console.log('Job Updated Result:', updatedJob);
            }
            return updatedNegotiation;
        });
    }
}
exports.default = NegotiationService;
