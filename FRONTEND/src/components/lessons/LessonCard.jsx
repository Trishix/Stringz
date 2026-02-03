import { Link } from 'react-router-dom';
import { Clock, Star, PlayCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LessonCard = ({ lesson, purchased: propPurchased = false }) => {
    const { user } = useAuth();

    // Check if lesson is purchased via prop OR via user context
    const isPurchased = propPurchased || (user?.purchases?.some(p =>
        (typeof p === 'string' && p === lesson._id) ||
        (typeof p === 'object' && p._id === lesson._id)
    ));

    const linkTo = isPurchased ? `/lessons/${lesson._id}/watch` : `/lessons/${lesson._id}`;

    return (
        <Link
            to={linkTo}
            className="block bg-gray-800/50 rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1 shadow-lg group"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={lesson.thumbnailUrl || 'https://via.placeholder.com/640x360?text=No+Thumbnail'}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${lesson.category === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        lesson.category === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                    </span>
                </div>

                {isPurchased && (
                    <div className="absolute top-2 right-2 flex gap-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-500/80 text-white flex items-center gap-1">
                            <CheckCircle size={12} /> Owned
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {lesson.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {lesson.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{lesson.duration}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{lesson.salesCount || 0} enrolled</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-gray-300">By {lesson.instructor}</span>
                    <span className="text-xl font-bold text-white">
                        {isPurchased ? 'Watch Now' : `₹${lesson.price}`}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default LessonCard;
