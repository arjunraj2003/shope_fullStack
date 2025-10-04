import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router =Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);
router.post("/refresh",AuthController.refresh);

router.get('/sample',authMiddleware,(req,res)=>{
    res.json({message:"working middleware"});
})

export default router;