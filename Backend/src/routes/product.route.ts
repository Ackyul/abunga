import { Router } from 'express';
import { getAll, create, sync, update, remove } from '../controllers/product.controller';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAll);
router.post('/', verifyToken, isAdmin, create);
router.put('/:id', verifyToken, isAdmin, update);
router.delete('/:id', verifyToken, isAdmin, remove);

router.post('/sync', verifyToken, isAdmin, sync);

export default router;
