"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = __importDefault(require("./review.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, review_controller_1.default.createReview.bind(review_controller_1.default));
router.get('/:userId', review_controller_1.default.getUserReviews.bind(review_controller_1.default));
exports.default = router;
