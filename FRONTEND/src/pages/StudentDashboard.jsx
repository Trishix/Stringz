import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import paymentService from '../services/paymentService';
import LessonGrid from '../components/lessons/LessonGrid';
import Loader from '../components/common/Loader';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import { useAuth } from '../context/AuthContext';
import { BookOpen, DollarSign, Clock, Flame, Coins } from 'lucide-react';

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

    const formatLearningTime = (minutes) => {
        if (!minutes) return "0 mins";
        if (minutes < 60) return `${minutes} mins`;
        const hours = (minutes / 60).toFixed(1);
        return `${hours} hrs`;
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Learning Time</p>
                                <p className="text-2xl font-bold">{formatLearningTime(stats.totalLearningTime)}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
                                <Flame size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Day Streak</p>
                                <p className="text-2xl font-bold">{stats.streak || 0}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                                <Coins size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Coins</p>
                                <p className="text-2xl font-bold">{stats.coins || 0}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-12">
                    <ActivityHeatmap activeDates={stats?.activeDates} />
                </div>

                <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
                <LessonGrid
                    lessons={purchases}
                    loading={loading}
                    emptyMessage="You haven't purchased any lessons yet."
                    emptyAction={
                        <Link
                            to="/lessons"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Explore Lessons
                        </Link>
                    }
                    purchased={true}
                />
            </div>
        </div>
    );
};

export default StudentDashboard