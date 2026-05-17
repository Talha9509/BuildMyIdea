import { Router } from "express";
import { blockConnect, sendConnectReq, updateConnect, withdrawConnect } from '../controllers/connect.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.post("/", authMiddleware, sendConnectReq);
router.put("/", authMiddleware, updateConnect);
router.post("/block", authMiddleware, blockConnect);
router.delete("/", authMiddleware, withdrawConnect);

export default router;