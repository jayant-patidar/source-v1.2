"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = __importDefault(require("./job.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.protect, job_controller_1.default.createJob.bind(job_controller_1.default));
router.get('/posted', auth_middleware_1.protect, job_controller_1.default.getJobsByPoster.bind(job_controller_1.default));
router.get('/worked', auth_middleware_1.protect, job_controller_1.default.getJobsByProvider.bind(job_controller_1.default));
router.get('/', job_controller_1.default.getAllJobs.bind(job_controller_1.default));
router.get('/:id', job_controller_1.default.getJobById.bind(job_controller_1.default));
router.put('/:id', auth_middleware_1.protect, job_controller_1.default.updateJob.bind(job_controller_1.default));
router.delete('/:id', auth_middleware_1.protect, job_controller_1.default.deleteJob.bind(job_controller_1.default));
exports.default = router;
