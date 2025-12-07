const User = require('../models/user');
const Lesson = require('../models/lesson');
const Transaction = require('../models/transaction');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalLessons = await Lesson.countDocuments();
        const totalTransactions = await Transaction.countDocuments({ status: 'completed' });

        const transactions = await Transaction.find({ status: 'completed' });
        const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            totalUsers,
            totalLessons,
            totalTransactions,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getSales = async (req, res) => {
    try {
        // Basic aggregation for last 7 days sales
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sales = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
