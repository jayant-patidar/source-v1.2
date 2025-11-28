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
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbConfig = {
            USER: process.env.DB_USER,
            PASSWORD: process.env.DB_PASSWORD,
            CLUSTER: process.env.DB_CLUSTER,
            TLD: process.env.DB_TLD,
            DB: process.env.DB_NAME,
        };
        const uri = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.${dbConfig.TLD}.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`;
        yield mongoose_1.default.connect(uri, {
            dbName: dbConfig.DB,
        });
        const connectedDbName = mongoose_1.default.connection.name;
        const expectedDbName = dbConfig.DB;
        if (connectedDbName === expectedDbName) {
            logger_1.default.info(`Connected to the ${expectedDbName} database`);
        }
        else {
            logger_1.default.warn(`Connected to a different database: ${connectedDbName}`);
        }
    }
    catch (error) {
        logger_1.default.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
});
exports.default = connectDB;
