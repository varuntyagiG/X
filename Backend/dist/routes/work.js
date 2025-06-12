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
const generative_ai_1 = require("@google/generative-ai");
const task_1 = __importDefault(require("../Database/task"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure env is loaded
const router = express_1.default.Router();
// Initialize Gemini with environment variable
const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
// POST /gemini-api/generate - Generate content from Gemini API
router.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ message: "Prompt is required" });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        return res.status(200).json({ content: text });
    }
    catch (error) {
        console.error("Gemini generation error:", error);
        return res.status(500).json({ message: "Error generating content" });
    }
}));
// POST /gemini-api/add - Create a task manually
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Content is required" });
        }
        const newTask = yield task_1.default.create({ content });
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating task" });
    }
}));
// GET /gemini-api/display - Get all tasks
router.get("/display", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
}));
// PUT /gemini-api/update/:id - Update task
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, completed } = req.body;
        const updatedTask = yield task_1.default.findByIdAndUpdate(req.params.id, { content, completed }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
}));
// DELETE /gemini-api/dlt/:id - Delete task
router.delete("/dlt/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield task_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
}));
exports.default = router;
