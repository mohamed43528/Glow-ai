import express from "express";
import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import bookingRouter from "./booking.routes.js";
import aiRouter from "./ai.routes.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/booking", bookingRouter);
router.use("/ai", aiRouter);

export default router;
