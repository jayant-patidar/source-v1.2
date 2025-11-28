"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const JobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    providerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    seekerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobDate: { type: Date, required: true },
    jobTime: { type: String, required: true },
    originalPay: { type: Number, required: true },
    updatedPay: [
        {
            pay: { type: Number, required: true },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
    location: {
        general: { type: String, required: true },
        exact: { type: String, required: true },
    },
    visibility: {
        type: Boolean,
        default: true,
    },
    isNegotiable: { type: Boolean, default: false },
    expirationDate: { type: Date, required: true },
    category: { type: String, required: true },
    status: {
        type: String,
        default: 'open',
        enum: ['open', 'accepted', 'completed', 'canceled'],
    },
    type: { type: String, required: false },
    tags: { type: [String], required: false },
}, { timestamps: true });
// Add geospatial index if needed later, for now keeping it simple as per request
// JobSchema.index({ 'location.coordinates': '2dsphere' });
exports.default = mongoose_1.default.model('Job', JobSchema);
