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
const negotiation_service_1 = __importDefault(require("./negotiation.service"));
class NegotiationController {
    constructor() {
        this.negotiationService = new negotiation_service_1.default();
    }
    createNegotiation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const negotiation = yield this.negotiationService.createNegotiation(req.body, req.user._id);
                res.status(201).json(negotiation);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getNegotiations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const negotiations = yield this.negotiationService.getNegotiationsByJobId(req.params.jobId);
                res.json(negotiations);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateNegotiationStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                const negotiation = yield this.negotiationService.updateNegotiationStatus(req.params.id, status, req.user._id);
                res.json(negotiation);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new NegotiationController();
