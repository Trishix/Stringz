const express = require('express');
const router = express.Router();
const { getStats, getSales, getUsers, deleteUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.use(auth, adminAuth); // Protect all routes in this file

router.get('/stats', getStats);
router.get('/sales', getSales);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
