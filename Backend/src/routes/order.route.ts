import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();


router.use(verifyToken);

router.post('/', createOrder);       
router.get('/my', getMyOrders);      

export default router;
