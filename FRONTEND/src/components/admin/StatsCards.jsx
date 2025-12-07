import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="bg-green-500/20 text-green-400"
            />
            <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="bg-blue-500/20 text-blue-400"
            />
            <StatsCard
                title="Total Lessons"
                value={stats.totalLessons}
                icon={BookOpen}
                color="bg-purple-500/20 text-purple-400"
            />
            <StatsCard
                title="Transactions"
                value={stats.totalTransactions}
                icon={TrendingUp}
                color="bg-orange-500/20 text-orange-400"
            />
        </div>
    );
};

export default StatsCards;
