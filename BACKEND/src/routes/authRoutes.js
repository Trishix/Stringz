const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateSignup, validateLogin, handleValidationErrors } = require('../utils/validators');

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/google', googleLogin);
router.get('/me', auth, getMe);

module.exports = router;
