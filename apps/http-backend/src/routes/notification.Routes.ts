import { Router } from "express";
import { getNotifications  } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.get("/", authMiddleware, getNotifications);

export default router;