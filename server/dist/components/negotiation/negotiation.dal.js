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
const negotiation_model_1 = __importDefault(require("./negotiation.model"));
class NegotiationDAL {
    createNegotiation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const negotiation = new negotiation_model_1.default(data);
            return yield negotiation.save();
        });
    }
    getNegotiationsByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield negotiation_model_1.default.find({ job: jobId })
                .populate('seeker', 'name rating')
                .populate('provider', 'name avatar providerRating')
                .sort({ createdAt: -1 });
        });
    }
    getNegotiationsByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield negotiation_model_1.default.find({ provider: providerId })
                .populate('job', 'title status originalPay')
                .populate('seeker', 'name avatar')
                .sort({ createdAt: -1 });
        });
    }
    getNegotiationsBySeeker(seekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield negotiation_model_1.default.find({ seeker: seekerId })
                .populate('job', 'title status originalPay')
                .populate('provider', 'name avatar providerRating')
                .sort({ createdAt: -1 });
        });
    }
    getNegotiationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield negotiation_model_1.default.findById(id);
        });
    }
    updateNegotiation(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield negotiation_model_1.default.findByIdAndUpdate(id, update, { new: true });
        });
    }
}
exports.default = NegotiationDAL;
