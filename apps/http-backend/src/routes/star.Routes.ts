import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { giveStar, deleteStar } from '../controllers/star.controller.js'

const router:Router = Router();

router.put("/:projectId/:submitId", authMiddleware, giveStar);
router.delete("/:projectId/:submitId", authMiddleware, deleteStar)

export default router;