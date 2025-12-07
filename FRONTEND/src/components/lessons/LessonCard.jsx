import { Link } from 'react-router-dom';
import { Clock, Star, PlayCircle, CheckCircle } from 'lucide-react';

const LessonCard = ({ lesson, purchased = false }) => {
    return (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1 shadow-lg group">
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

                {purchased && (
                    <div className="absolute top-2 right-2 flex gap-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-500/80 text-white flex items-center gap-1">
                            <CheckCircle size={12} /> Owned
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <Link to={`/lessons/${lesson._id}`}>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {lesson.title}
                    </h3>
                </Link>
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
                        <span>{lesson.popularity || 0} enrolled</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-gray-300">By {lesson.instructor}</span>
                    <span className="text-xl font-bold text-white">
                        {purchased ? 'Watch Now' : `₹${lesson.price}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
