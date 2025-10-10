import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router=Router()

router.post('/',authMiddleware,messageController.createMessage);
router.get('/',authMiddleware,messageController.getAllMessages);
router.patch('/:id/read',authMiddleware,messageController.markAsRead);

export default router; 