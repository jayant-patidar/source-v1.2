"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const negotiation_controller_1 = __importDefault(require("./negotiation.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, (req, res, next) => negotiation_controller_1.default.createNegotiation(req, res, next));
router.get('/my-offers', auth_middleware_1.protect, (req, res, next) => negotiation_controller_1.default.getNegotiationsByUser(req, res, next));
router.get('/received', auth_middleware_1.protect, (req, res, next) => negotiation_controller_1.default.getNegotiationsReceived(req, res, next));
router.get('/:jobId', auth_middleware_1.protect, (req, res, next) => negotiation_controller_1.default.getNegotiations(req, res, next));
router.put('/:id', auth_middleware_1.protect, (req, res, next) => negotiation_controller_1.default.updateNegotiationStatus(req, res, next));
exports.default = router;
