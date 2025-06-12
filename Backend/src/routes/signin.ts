import express, { Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Database/signup";

const router = express.Router();

router.post("/", async (req: any, res: Response) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return basic user info
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
