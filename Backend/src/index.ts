import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import router from "./routes/signUp";
import routerr from "./routes/signin";
import work from "./routes/work";
import { connectDB } from "./Database/DB";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Default to 4000 if not set in .env

app.use(cors());
app.use(bodyParser.json());

app.use("/signUp", router);
app.use("/signin", routerr);
app.use("/gemini-api", work);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Stop server if DB fails
  }
};

startServer();
