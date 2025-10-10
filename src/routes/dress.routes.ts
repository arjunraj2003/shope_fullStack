import Router from 'express';
import { DressController } from '../controllers/dress.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadDressImages } from '../middleware/dressUpload';


const router=Router()

router.post('/',authMiddleware,uploadDressImages.array("images",5),DressController.createDress);
router.get('/',DressController.getAllDress);
router.get('/:id',DressController.getDressById);
router.put('/:id',uploadDressImages.array("images",5),authMiddleware,DressController.updateDress);
router.delete('/:id',authMiddleware,DressController.deleteDress);

export default router;