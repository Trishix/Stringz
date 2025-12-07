import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatsCards from '../components/admin/StatsCards';
import SalesChart from '../components/admin/SalesChart';
import UserTable from '../components/admin/UserTable';
import Loader from '../components/common/Loader';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, salesRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/sales'),
                    api.get('/admin/users')
                ]);

                setStats(statsRes.data);
                setSalesData(salesRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUserDelete = (userId) => {
        setUsers(users.filter(u => u._id !== userId));
    };

    if (loading) return <div className="min-h-screen pt-20 bg-gray-900"><Loader /></div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Link to="/admin/lessons" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Manage Lessons
                    </Link>
                </div>

                <StatsCards stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <SalesChart data={salesData} />
                    </div>
                    {/* Recent Users or any other widget could go here, or just let chart span full width if needed 
              For now keeping chart as 2/3 and maybe just User Manage below */}
                </div>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">User Management</h2>
                    <UserTable users={users} onDelete={handleUserDelete} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
