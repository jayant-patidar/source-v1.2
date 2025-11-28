"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const negotiation_controller_1 = __importDefault(require("./negotiation.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, negotiation_controller_1.default.createNegotiation.bind(negotiation_controller_1.default));
router.get('/:jobId', auth_middleware_1.protect, negotiation_controller_1.default.getNegotiations.bind(negotiation_controller_1.default));
router.put('/:id', auth_middleware_1.protect, negotiation_controller_1.default.updateNegotiationStatus.bind(negotiation_controller_1.default));
exports.default = router;
