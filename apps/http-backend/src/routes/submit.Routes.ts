import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createSubmit, updateSubmit, deleteSubmit, getSubmitbyId } from '../controllers/submit.controller.js'

const router:Router = Router();

router.post("/:id{/team}", authMiddleware, createSubmit);
router.patch("/:id", authMiddleware, updateSubmit);
router.delete("/:id", authMiddleware, deleteSubmit);
router.get("/:id", authMiddleware, getSubmitbyId);

export default router;