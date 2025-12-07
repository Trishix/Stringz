const User = require('../models/user');

const adminAuth = async (req, res, next) => {
    try {
        // req.user is already set by auth middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Double check with DB to ensure role hasn't changed
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        console.error('Admin Auth Error:', error);
        res.status(500).json({ message: 'Server error during authorization' });
    }
};

module.exports = adminAuth;
