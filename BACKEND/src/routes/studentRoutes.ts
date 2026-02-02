import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { auth } from '../middleware/auth';

const router = Router();
const studentController = new StudentController();

router.get('/purchases', auth, studentController.getPurchases);
router.get('/dashboard', auth, studentController.getDashboard);
router.get('/check-access/:lessonId', auth, studentController.checkAccess);

export default router;
