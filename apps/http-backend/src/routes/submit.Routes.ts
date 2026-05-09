import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createSubmit, updateSubmit, deleteSubmit } from '../controllers/submit.controller.js'

const router:Router = Router();

router.post("/:id", authMiddleware, createSubmit);
router.patch("/:id", authMiddleware, updateSubmit);
router.delete("/:id", authMiddleware, deleteSubmit);

export default router;