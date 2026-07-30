import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerProjectPayment } from '../controllers/webhook.controller.js'

const router:Router = Router();

router.post("/razorpay", ownerProjectPayment);

export default router;