import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { auth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiters';
import { validateSignup, validateLogin, validateGoogleLogin, handleValidationErrors } from '../utils/validators';

const router = Router();
const authController = new AuthController(); // Instantiate class controller

// Note: In class-based handlers, we sometimes need to bind 'this', but using arrow functions in class properties handles that.

router.post('/signup', authLimiter, validateSignup, handleValidationErrors, authController.signup);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, authController.login);
router.post('/google', authLimiter, validateGoogleLogin, handleValidationErrors, authController.googleLogin);
router.get('/me', auth, authController.getMe);

export default router;
