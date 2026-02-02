import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { auth } from '../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

router.post('/create-order', auth, paymentController.createOrder);
router.post('/verify', auth, paymentController.verifyPayment);

export default router;
