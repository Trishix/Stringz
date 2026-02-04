import { useState, useEffect } from 'react';
import { Star, User, MoreVertical, Send, ThumbsUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const reviewService = {
    getReviews: async (lessonId) => {
        const response = await api.get(`/reviews/${lessonId}`);
        return response.data;
    },
    createReview: async (data) => {
        const response = await api.post(`/reviews`, data);
        return response.data;
    }
};

const CommentsSection = ({ lessonId }) => {
    const { user, token, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewService.getReviews(lessonId);
                setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };

        fetchReviews();
    }, [lessonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return alert("Please login to comment");
        if (rating === 0) return alert("Please provide a rating");

        try {
            setSubmitting(true);
            const newReview = await reviewService.createReview({
                lessonId,
                rating,
                comment: newComment
            }, token);

            setReviews([newReview, ...reviews]);
            setNewComment('');
            setRating(0);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {reviews.length} Comments
            </h3>

            {/* Input Form */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    {isAuthenticated ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <div className="grow">
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Star Rating Input */}
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={20}
                                            className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-transparent border-b border-gray-700 focus:border-white text-white py-2 outline-none min-h-[40px] resize-y placeholder-gray-500 transition-colors"
                                    rows={1}
                                />
                                {newComment && (
                                    <div className="flex justify-end mt-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewComment('')}
                                            className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-4 py-2 text-sm bg-blue-600 text-black font-semibold rounded-full hover:bg-blue-500 disabled:opacity-50"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    ) : (
                        <p className="text-gray-400 text-sm pt-2">Please login to leave a comment.</p>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold shrink-0 text-sm">
                            {review.userId?.name?.charAt(0) || '?'}
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold text-sm">
                                    {review.userId?.name || 'Anonymous'}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed">
                                {review.comment}
                            </p>

                            <div className="flex items-center gap-4 mt-3">
                                <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs transition-colors">
                                    <ThumbsUp size={14} />
                                    <span>Helpful</span>
                                </button>
                                {/* Reply button could be here */}
                            </div>
                        </div>

                        {/* Options Menu (visible on hover) */}
                        <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white p-2 transition-all">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
