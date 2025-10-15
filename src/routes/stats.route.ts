import { Router } from "express";
import { statsController } from "../controllers/stats.controller";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware";

const router=Router()

router.get('/',authMiddleware,isAdmin,statsController.getStat);

export default router