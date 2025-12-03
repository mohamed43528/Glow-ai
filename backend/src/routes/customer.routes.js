import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getCustomerCards,
  addCustomerCard,
  deleteCustomerCard
} from "../controllers/customer.controller.js";

const router = Router();

router.get("/cards", authMiddleware, getCustomerCards);
router.post("/cards/add", authMiddleware, addCustomerCard);
router.delete("/cards/delete", authMiddleware, deleteCustomerCard);

export default router;
