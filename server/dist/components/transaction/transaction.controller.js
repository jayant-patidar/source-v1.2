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
exports.getTransactionsByJob = exports.createTransaction = void 0;
const transaction_model_1 = __importDefault(require("./transaction.model"));
const job_model_1 = __importDefault(require("../job/job.model"));
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, payorId, payeeId, amount, paymentMethod, metadata } = req.body;
        const transaction = new transaction_model_1.default({
            jobId,
            payerId: payorId,
            payeeId,
            amount,
            paymentMethod,
            status: 'success', // Mocking success for now
            metadata
        });
        yield transaction.save();
        // Update Job Payment Status
        yield job_model_1.default.findByIdAndUpdate(jobId, { paymentStatus: 'paid' });
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error('Create Transaction Error:', error);
        res.status(500).json({ message: 'Failed to process payment' });
    }
});
exports.createTransaction = createTransaction;
const getTransactionsByJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const transactions = yield transaction_model_1.default.find({ jobId }).sort({ createdAt: -1 });
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});
exports.getTransactionsByJob = getTransactionsByJob;
