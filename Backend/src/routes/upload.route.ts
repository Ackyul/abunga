import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', verifyToken, isAdmin, upload.single('image'), uploadImage);

export default router;
