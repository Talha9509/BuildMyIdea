import { Router } from "express";
import { disConnect, sendConnectReq, updateConnect, withdrawConnect } from '../controllers/connect.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.post("/", authMiddleware, sendConnectReq);
router.put("/", authMiddleware, updateConnect);
router.post("/withdraw", authMiddleware, withdrawConnect);
router.delete("/", authMiddleware, disConnect);

export default router;