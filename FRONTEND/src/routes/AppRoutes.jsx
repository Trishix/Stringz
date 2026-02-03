import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Loader from '../components/common/Loader';

// Layout
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Pages - Lazy Loaded
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/login'));
const Signup = lazy(() => import('../pages/signup'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const Catalog = lazy(() => import('../pages/Catalog'));
const LessonDetail = lazy(() => import('../pages/LessonDetail'));
const StudentDashboard = lazy(() => import('../pages/StudentDashboard'));
const VideoPlayerPage = lazy(() => import('../pages/VideoPlayerPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminLessons = lazy(() => import('../pages/AdminLessons'));

const AppRoutes = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="flex-grow">
                <Suspense fallback={<Loader fullScreen />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/about" element={<AboutPage />} />
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
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default AppRoutes;
