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
const review_dal_1 = __importDefault(require("./review.dal"));
const user_dal_1 = __importDefault(require("../user/user.dal"));
const job_dal_1 = __importDefault(require("../job/job.dal"));
class ReviewService {
    constructor() {
        this.reviewDAL = new review_dal_1.default();
        this.userDAL = new user_dal_1.default();
        this.jobDAL = new job_dal_1.default();
    }
    createReview(data, reviewerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jobId, revieweeId, rating, comment } = data;
            // Check if review already exists
            const existingReview = yield this.reviewDAL.checkReviewExists(jobId, reviewerId, revieweeId);
            if (existingReview) {
                throw new Error('You have already reviewed this user for this job');
            }
            const review = yield this.reviewDAL.createReview({
                job: jobId,
                reviewer: reviewerId,
                reviewee: revieweeId,
                rating,
                comment,
            });
            // Update user rating
            // We need to know if reviewee was seeker or provider
            const job = yield this.jobDAL.getJobById(jobId);
            if (job) {
                const reviews = yield this.reviewDAL.getReviewsByRevieweeId(revieweeId);
                const numReviews = reviews.length;
                const ratingSum = reviews.reduce((acc, item) => item.rating + acc, 0);
                const avgRating = ratingSum / numReviews;
                // Determine role
                // If reviewee is job.seekerId -> They are the Seeker (Poster) -> Update seekerRating
                // If reviewee is job.providerId -> They are the Provider (Worker) -> Update providerRating
                // Note: job.seekerId is an ObjectId, need to convert to string for comparison
                if (job.seekerId.toString() === revieweeId) {
                    // Update seekerRating
                    // UserDAL doesn't have generic update method exposed in my previous step, let's use direct model or add method.
                    // I'll assume I can add a method to UserDAL or just use the model in Service if needed, but better to keep it in DAL.
                    // For now, I'll instantiate User model directly here or add update to UserDAL?
                    // I'll add `updateUser` to UserDAL in a separate step or just use `User.findByIdAndUpdate` if I import the model.
                    // But I should stick to DAL pattern.
                    // Let's import User model here for now to avoid circular dependency hell or just add update to UserDAL.
                    // I will import User model from component.
                    const User = require('../user/user.model').default;
                    yield User.findByIdAndUpdate(revieweeId, { seekerRating: avgRating });
                }
                else if (job.providerId && job.providerId.toString() === revieweeId) {
                    const User = require('../user/user.model').default;
                    yield User.findByIdAndUpdate(revieweeId, { providerRating: avgRating });
                }
            }
            return review;
        });
    }
    getUserReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewDAL.getReviewsByRevieweeId(userId);
        });
    }
}
exports.default = ReviewService;
