import express from "express";

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  res.json({ message: "Register endpoint works" });
});

// Login
router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint works" });
});

// Get current user
router.get("/me", (req, res) => {
  res.json({ message: "User endpoint works" });
});

export default router;
