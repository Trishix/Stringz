import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Stringz
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {!isAdmin && (
                                <>
                                    <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                    <Link to="/lessons" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Lessons</Link>
                                </>
                            )}

                            {isAuthenticated ? (
                                <>
                                    {isAdmin ? (
                                        <Link to="/admin" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                                    ) : (
                                        <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                                    <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-purple-500/20">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {!isAdmin && (
                            <>
                                <Link to="/" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Home</Link>
                                <Link to="/lessons" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Lessons</Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <>
                                {isAdmin ? (
                                    <Link to="/admin" className="block text-white hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left bg-red-500/10 text-red-400 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/signup" className="block bg-purple-600 text-white px-3 py-2 rounded-md text-base font-medium">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
