import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { onboardDev, Payout } from '../controllers/payment.controller.js'

const router:Router = Router();

router.post("/onboard-dev", authMiddleware, onboardDev);
router.post("/payout/:projectId/:submitId", Payout)

export default router;