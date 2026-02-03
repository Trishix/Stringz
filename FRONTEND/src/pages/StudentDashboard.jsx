import { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import LessonGrid from '../components/lessons/LessonGrid';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { BookOpen, DollarSign, Clock } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, purchasesData] = await Promise.all([
                    paymentService.getDashboardStats(),
                    paymentService.getUserPurchases()
                ]);
                setStats(statsData);
                setPurchases(purchasesData);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-400 mt-2">Pick up where you left off.</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Purchased Lessons</p>
                                <p className="text-2xl font-bold">{stats.purchaseCount}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Invested</p>
                                <p className="text-2xl font-bold">₹{stats.totalSpent}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Learning Time</p>
                                <p className="text-2xl font-bold">-- hrs</p>
                                {/* Note: Learning time tracking was low priority, leaving placeholder */}
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
                <LessonGrid
                    lessons={purchases}
                    loading={loading}
                    emptyMessage="You haven't purchased any lessons yet."
                    purchased={true}
                />
            </div>
        </div>
    );
};

export default StudentDashboard;
