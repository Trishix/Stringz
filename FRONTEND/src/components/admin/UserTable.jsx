import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserTable = ({ users, onDelete }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setDeletingId(userId);
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success('User deleted');
                onDelete(userId);
            } catch {
                toast.error('Failed to delete user');
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/80">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{user.name}</div>
                                            <div className="text-sm text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user.role !== 'admin' && ( // Don't allow deleting admins for safety in this demo
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            disabled={deletingId === user._id}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
