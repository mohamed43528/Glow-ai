import { Router } from "express"; import { sendMagicLink, verifyMagicLink } from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-magic-link", sendMagicLink); router.post("/verify", verifyMagicLink);

export default router;
