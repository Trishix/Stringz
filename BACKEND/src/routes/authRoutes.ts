import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { auth } from '../middleware/auth';
import { validateSignup, validateLogin, handleValidationErrors } from '../utils/validators';

const router = Router();
const authController = new AuthController(); // Instantiate class controller

// Note: In class-based handlers, we sometimes need to bind 'this', but using arrow functions in class properties handles that.

router.post('/signup', validateSignup, handleValidationErrors, authController.signup);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/google', authController.googleLogin);
router.get('/me', auth, authController.getMe);

export default router;
