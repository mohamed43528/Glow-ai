import express from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);

// Add more routes later if needed
// router.use("/booking", bookingRouter);
// router.use("/ai", aiRouter);

export default router;
