import { Router } from "express";
import { getMyProfile, editProfile, getProfilebyId  } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.patch("/", authMiddleware, editProfile);
router.get("/me", authMiddleware, getMyProfile);
router.get("/:id", authMiddleware, getProfilebyId);

export default router;