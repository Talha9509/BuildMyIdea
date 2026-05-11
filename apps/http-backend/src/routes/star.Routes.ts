import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { giveStar, deleteStar } from '../controllers/star.controller.js'

const router:Router = Router();

router.put("/:id", authMiddleware, giveStar);
router.delete("/:id", authMiddleware, deleteStar)

export default router;