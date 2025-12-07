import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import lessonService from '../services/lessonService';
import paymentService from '../services/paymentService';
import Loader from '../components/common/Loader';
import PurchaseButton from '../components/lessons/PurchaseButton';
import { useAuth } from '../context/AuthContext';
import { Clock, BarChart, User, Share2, PlayCircle, CheckCircle } from 'lucide-react';
import ReviewSection from '../components/reviews/ReviewSection';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lessonData = await lessonService.getLessonById(id);
                setLesson(lessonData);

                if (isAuthenticated) {
                    const accessData = await paymentService.checkAccess(id);
                    setHasAccess(accessData.hasAccess);
                }
            } catch (error) {
                console.error("Failed to load lesson", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated]);

    if (loading) return <div className="min-h-screen pt-20"><Loader /></div>;
    if (!lesson) return <div className="min-h-screen text-center pt-32 text-white">Lesson not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={lesson.thumbnailUrl || 'https://via.placeholder.com/1280x720?text=No+Thumbnail'}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-8 max-w-7xl mx-auto mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${lesson.category === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            lesson.category === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {lesson.category.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
                            HD VIDEO
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{lesson.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                            <User size={18} /> <span>{lesson.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} /> <span>{lesson.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BarChart size={18} /> <span>{lesson.salesCount} Students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800/50 rounded-2xl p-8 border border-white/5 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-4">About this course</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{lesson.description}</p>
                        </div>

                        <ReviewSection lessonId={id} />

                        {/* Curriculum or other details could go here */}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/80 rounded-2xl p-6 border border-white/10 sticky top-24 shadow-2xl backdrop-blur-xl">
                            <div className="text-center mb-6">
                                <p className="text-gray-400 text-sm mb-1">{hasAccess ? 'You own this course' : 'One-time payment'}</p>
                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                    {hasAccess ? 'Purchased' : `₹${lesson.price}`}
                                </div>
                            </div>

                            {hasAccess ? (
                                <Link
                                    to={`/lessons/${id}/watch`}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105"
                                >
                                    <PlayCircle size={20} /> Watch Now
                                </Link>
                            ) : (
                                <PurchaseButton
                                    lessonId={id}
                                    price={lesson.price}
                                    onPurchaseSuccess={() => setHasAccess(true)}
                                />
                            )}

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <PlayCircle size={16} className="text-purple-400" />
                                    <span>Full lifetime access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <CheckCircle size={16} className="text-purple-400" />
                                    <span>Access on mobile and TV</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Share2 size={16} className="text-purple-400" />
                                    <span>Certificate of completion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
