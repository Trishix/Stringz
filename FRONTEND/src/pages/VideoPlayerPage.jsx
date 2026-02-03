import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import lessonService from '../services/lessonService';
import paymentService from '../services/paymentService';
import VideoPlayer from '../components/lessons/VideoPlayer';
import Loader from '../components/common/Loader';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth(); // Get auth state
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch lesson details first to check price
                const lessonData = await lessonService.getLessonById(id);
                setLesson(lessonData);

                // If lesson is free
                if (lessonData.price === 0) {
                    if (!isAuthenticated) {
                        setError('Please login to watch free lessons.');
                    } else {
                        // Grant access if logged in
                        setLoading(false);
                        return;
                    }
                } else {
                    // If not free, check for purchase (requires auth usually checked by service or here)
                    if (!isAuthenticated) {
                        setError('Please login to purchase this lesson.');
                    } else {
                        const { hasAccess } = await paymentService.checkAccess(id);
                        if (!hasAccess) {
                            setError('Access Denied. You have not purchased this lesson.');
                        }
                    }
                }
            } catch (err) {
                setError('Failed to load lesson. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) init();
    }, [id, isAuthenticated]);

    if (loading) return <Loader fullScreen />;

    if (error) return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <Lock className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            {error.includes('login') ? (
                <Link to="/login" className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
                    Go to Login
                </Link>
            ) : (
                <Link to={`/lessons/${id}`} className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
                    Go to Lesson Page
                </Link>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
                    <p className="text-gray-400">Instructor: {lesson.instructor}</p>
                </div>

                <VideoPlayer
                    src={lesson.videoUrl}
                    poster={lesson.thumbnailUrl}
                    onHeartbeat={async (data) => {
                        try {
                            await paymentService.updateProgress(id, data.duration, data.position);
                        } catch (err) {
                            console.error("Failed to update progress", err);
                        }
                    }}
                />

                <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-white/5">
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{lesson.description}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
