import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { onboardDev, Payout, updateProductConfig } from '../controllers/payment.controller.js'

const router:Router = Router();

router.post("/onboard-dev", authMiddleware, onboardDev);
router.post("/product-config/:accountId/:productId", authMiddleware, updateProductConfig)
router.post("/payout/:projectId/:submitId", authMiddleware, Payout)

export default router;