import express from "express";

const router = express.Router();

// Simple health check endpoint
router.get("/", (req, res) => {
  res.json({ status: "ok", message: "Glow AI backend is running" });
});

export default router;
