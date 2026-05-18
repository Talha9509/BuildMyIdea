import { Router } from "express";
import { getChatsbyId } from '../controllers/chat.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.get("/:id", authMiddleware, getChatsbyId);

export default router;