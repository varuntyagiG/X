import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import task from "../Database/task";
import dotenv from "dotenv";

dotenv.config(); // Ensure env is loaded

const router = express.Router();

// Initialize Gemini with environment variable
const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(geminiKey);

// POST /gemini-api/generate - Generate content from Gemini API
router.post("/generate", async (req: any, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ content: text });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({ message: "Error generating content" });
  }
});

// POST /gemini-api/add - Create a task manually
router.post("/add", async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newTask = await task.create({ content });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// GET /gemini-api/display - Get all tasks
router.get("/display", async (_req: Request, res: Response) => {
  try {
    const tasks = await task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// PUT /gemini-api/update/:id - Update task
router.put("/update/:id", async (req: any, res: Response) => {
  try {
    const { content, completed } = req.body;
    const updatedTask = await task.findByIdAndUpdate(
      req.params.id,
      { content, completed },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /gemini-api/dlt/:id - Delete task
router.delete("/dlt/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
