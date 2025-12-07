const instance = require('../config/razorpay');
const crypto = require('crypto');
const Transaction = require('../models/transaction');
const Lesson = require('../models/lesson');
const User = require('../models/user');

exports.createOrder = async (req, res) => {
    try {
        const { lessonId } = req.body;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const options = {
            amount: lesson.price * 100, // amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            lessonId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const lesson = await Lesson.findById(lessonId);

            // 1. Create Transaction
            await Transaction.create({
                userId: req.user.id,
                lessonId: lessonId,
                amount: lesson.price,
                status: 'completed',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            });

            // 2. Add to User Purchases
            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { purchases: lessonId }
            });

            // 3. Increment Sales Count
            lesson.salesCount += 1;
            await lesson.save();

            res.json({ message: 'Payment successful', success: true });
        } else {
            res.status(400).json({ message: 'Payment verification failed', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
