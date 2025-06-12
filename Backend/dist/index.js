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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const signUp_1 = __importDefault(require("./routes/signUp"));
const signin_1 = __importDefault(require("./routes/signin"));
const work_1 = __importDefault(require("./routes/work"));
const DB_1 = require("./Database/DB");
// Load environment variables from .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000; // Default to 4000 if not set in .env
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/signUp", signUp_1.default);
app.use("/signin", signin_1.default);
app.use("/gemini-api", work_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DB_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Stop server if DB fails
    }
});
startServer();
