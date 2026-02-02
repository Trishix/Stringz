import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { auth } from '../middleware/auth';
import adminAuth from '../middleware/adminAuth';

const router = Router();
const adminController = new AdminController();

router.use(auth, adminAuth);

router.get('/stats', adminController.getStats);
router.get('/sales', adminController.getSales);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

export default router;
