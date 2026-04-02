import { Router } from 'express';
import { getAll, create, remove } from '../controllers/category.controller';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAll);
router.post('/', verifyToken, isAdmin, create);
router.delete('/:id', verifyToken, isAdmin, remove);

export default router;
