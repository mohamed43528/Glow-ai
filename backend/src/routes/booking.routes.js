import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createBooking,
  rescheduleBooking,
  cancelBooking,
  getAvailability
} from "../controllers/booking.controller.js";

const router = Router();

router.get("/availability", getAvailability);
router.post("/create", createBooking);
router.post("/reschedule", authMiddleware, rescheduleBooking);
router.post("/cancel", authMiddleware, cancelBooking);

export default router;

