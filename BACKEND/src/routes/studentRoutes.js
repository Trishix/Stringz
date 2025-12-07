const express = require('express');
const router = express.Router();
const { getPurchases, getDashboard, checkAccess } = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/purchases', auth, getPurchases);
router.get('/dashboard', auth, getDashboard);
router.get('/check-access/:lessonId', auth, checkAccess);

module.exports = router;
