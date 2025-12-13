"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.protect, transaction_controller_1.createTransaction);
router.get('/job/:jobId', auth_middleware_1.protect, transaction_controller_1.getTransactionsByJob);
exports.default = router;
