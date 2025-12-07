import { useState } from 'react';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, Loader } from 'lucide-react';

const PurchaseButton = ({ lessonId, price, onPurchaseSuccess }) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Load Razorpay script dynamically if not present
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to purchase');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 1. Create Order
            const order = await paymentService.createOrder(lessonId);

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Stringz Guitar Platform",
                description: "Lesson Purchase",
                image: "/logo.png", // Add logo if available
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            lessonId
                        };

                        const verification = await paymentService.verifyPayment(verifyData);

                        if (verification.success) {
                            toast.success('Payment Successful!');
                            if (onPurchaseSuccess) onPurchaseSuccess();
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: "" // Can add phone if stored in user profile
                },
                notes: {
                    address: "Stringz Corporate Office"
                },
                theme: {
                    color: "#7C3AED" // Purple-600
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong with the purchase');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader className="animate-spin h-5 w-5" />
            ) : (
                <>
                    <CreditCard size={20} />
                    Buy for ₹{price}
                </>
            )}
        </button>
    );
};

export default PurchaseButton;
