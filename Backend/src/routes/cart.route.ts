import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();


router.use(verifyToken);

router.get('/', getCart);              
router.post('/add', addItem);          
router.put('/item/:id', updateItem);   
router.delete('/item/:id', removeItem);
router.delete('/', clearCart);         

export default router;
