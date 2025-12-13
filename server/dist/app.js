"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const error_middleware_1 = require("./middleware/error.middleware");
const user_routes_1 = __importDefault(require("./components/user/user.routes"));
const job_routes_1 = __importDefault(require("./components/job/job.routes"));
const transaction_routes_1 = __importDefault(require("./components/transaction/transaction.routes"));
const negotiation_routes_1 = __importDefault(require("./components/negotiation/negotiation.routes"));
const review_routes_1 = __importDefault(require("./components/review/review.routes"));
const notification_routes_1 = __importDefault(require("./components/notification/notification.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}));
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Use new component routes
app.use('/api/users', user_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/negotiations', negotiation_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
// Error Handler
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
