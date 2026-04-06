import { Router } from 'express';
import { checkoutByOrderId } from '../controllers/stripe.controller';

const router = Router();

router.get('/checkout/:orderId', checkoutByOrderId);

export default router;
