import express, { Router } from "express";
import { ai } from '../controllers/ai.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = express.Router();

router.get("/", authMiddleware, ai)

export default router;