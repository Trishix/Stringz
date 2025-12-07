import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Layout
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Pages
import Home from '../pages/Home';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Catalog from '../pages/Catalog';
import LessonDetail from '../pages/LessonDetail';
import StudentDashboard from '../pages/StudentDashboard';
import VideoPlayerPage from '../pages/VideoPlayerPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLessons from '../pages/AdminLessons';

const AppRoutes = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/lessons" element={<Catalog />} />
                    <Route path="/lessons/:id" element={<LessonDetail />} />

                    {/* Protected Student Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<StudentDashboard />} />
                        <Route path="/lessons/:id/watch" element={<VideoPlayerPage />} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/lessons" element={<AdminLessons />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default AppRoutes;
