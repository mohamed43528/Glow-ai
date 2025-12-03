import { Router } from "express";
import { authBusiness } from "../middleware/authBusiness.js";
import { getSettings, updateSettings } from "../controllers/business.controller.js";

const router = Router();

router.get("/settings", authBusiness, getSettings);
router.post("/settings", authBusiness, updateSettings);

export default router;
