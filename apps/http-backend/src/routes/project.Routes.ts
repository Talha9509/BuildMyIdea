import { Router } from "express";
import { createProject, getProjects, updateProject, deleteProject, getProjectbyId, getProjectbySearch } from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/search", authMiddleware, getProjectbySearch);
router.get("/:id", authMiddleware, getProjectbyId);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;