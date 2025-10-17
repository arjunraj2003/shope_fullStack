import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware";

const router=Router()

router.post('/',authMiddleware,messageController.createMessage);
router.get('/',authMiddleware,isAdmin,messageController.getAllMessages);
router.patch('/:id/read',authMiddleware,isAdmin,messageController.markAsRead);

export default router; 