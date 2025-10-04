import Router from 'express';
import { DressController } from '../controllers/dress.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router=Router()

router.post('/',authMiddleware,DressController.createDress);
router.get('/',DressController.getAllDress);
router.get('/:id',DressController.getDressById);
router.put('/:id',authMiddleware,DressController.updateDress);
router.delete('/:id',authMiddleware,DressController.deleteDress);

export default router;