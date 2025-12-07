const User = require('../models/user');
const Transaction = require('../models/transaction');

exports.getPurchases = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'purchases',
            populate: { path: 'instructor', select: 'name' } // Assuming instructor is just a string name in Lesson for now, but if it was a ref this would be relevant
        });

        // Since purchases is ref to Lesson
        res.json(user.purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('purchases');

        // Calculate total spent using transactions
        const transactions = await Transaction.find({ userId: req.user.id, status: 'completed' });
        const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            purchaseCount: user.purchases.length,
            totalSpent,
            recentLessons: user.purchases.slice(-3) // Last 3 purchases
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.checkAccess = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const hasAccess = user.purchases.includes(req.params.lessonId);

        res.json({ hasAccess });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
