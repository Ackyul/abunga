import { Router } from 'express';
import { createCheckoutSession } from '../controllers/stripe.controller';

const router = Router();

router.post('/checkout', createCheckoutSession);

export default router;
