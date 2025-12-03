import { Router } from "express";

const router = Router();

// This route is intentionally unused because card actions live in customer.routes
router.get("/", (req, res) =>
  res.status(501).json({ error: "Handled in customer.routes.js" })
);

export default router;
