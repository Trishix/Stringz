import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import lessonService from '../services/lessonService';
import paymentService from '../services/paymentService';
import VideoPlayer from '../components/lessons/VideoPlayer';
import Loader from '../components/common/Loader';
import { ArrowLeft, Lock, Clock, Calendar, Star, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch lesson details
                const lessonData = await lessonService.getLessonById(id);
                setLesson(lessonData);

                // Access Control
                if (lessonData.price === 0) {
                    if (!isAuthenticated) setError('Please login to watch free lessons.');
                    else setLoading(false);
                } else {
                    if (!isAuthenticated) setError('Please login to purchase this lesson.');
                    else {
                        const { hasAccess } = await paymentService.checkAccess(id);
                        if (!hasAccess) setError('Access Denied. You have not purchased this lesson.');
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
        <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
            <Lock className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-3xl font-bold mb-3">Access Restricted</h2>
            <p className="text-gray-400 mb-8 text-lg">{error}</p>
            {error.includes('login') ? (
                <Link to="/login" className="px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 font-semibold transition-all">
                    Login to Continue
                </Link>
            ) : (
                <Link to={`/lessons/${id}`} className="px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 font-semibold transition-all">
                    View Lesson Details
                </Link>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            {/* Header / Nav Area */}
            <div className="border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center">
                    <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Dashboard</span>
                    </Link>
                </div>
            </div>

            {/* Theater Mode Video Section */}
            <div className="w-full bg-black border-b border-white/10 shadow-2xl relative">
                <div className="max-w-[1600px] mx-auto">
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
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content: Title & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${lesson.category === 'beginner' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        lesson.category === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {lesson.category}
                                </span>
                                <span className="text-gray-500 text-sm">•</span>
                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                    <Calendar size={14} />
                                    Updated {new Date(lesson.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                                {lesson.title}
                            </h1>

                            <div className="flex items-center gap-4 py-4 border-y border-white/5">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold">
                                    {lesson.instructor.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Instructor</p>
                                    <p className="text-white font-medium text-lg">{lesson.instructor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-4">About this lesson</h3>
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {lesson.description}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Metadata & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#111] rounded-2xl p-6 border border-white/10 sticky top-24">
                            <h3 className="text-lg font-semibold text-white mb-6">Lesson Details</h3>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                        <div className="p-2 bg-white/5 rounded-lg text-purple-400">
                                            <Clock size={20} />
                                        </div>
                                        <span>Duration</span>
                                    </div>
                                    <span className="font-medium text-white">{lesson.duration} mins</span>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                        <div className="p-2 bg-white/5 rounded-lg text-yellow-400">
                                            <Star size={20} />
                                        </div>
                                        <span>Enrolled</span>
                                    </div>
                                    <span className="font-medium text-white">{lesson.salesCount || 0} students</span>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                                        <div className="p-2 bg-white/5 rounded-lg text-blue-400">
                                            <Globe size={20} />
                                        </div>
                                        <span>Language</span>
                                    </div>
                                    <span className="font-medium text-white">English</span>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5">
                                Mark as Completed
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
