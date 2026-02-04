import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import reviewService from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import { Star, Trash2, Edit2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReviewSection = ({ lessonId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const [editingReview, setEditingReview] = useState(null);

    // Simple date formatter if date-fns not available
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewService.getLessonReviews(lessonId);
                setReviews(data);
            } catch (error) {
                console.error("Failed to load reviews", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [lessonId]);

    const handleAddReview = async ({ rating, comment, id }) => {
        try {
            if (id) {
                // Update
                const updated = await reviewService.updateReview(id, rating, comment);
                setReviews(reviews.map(r => r._id === id ? updated : r));
                toast.success("Review updated");
                setEditingReview(null);
            } else {
                // Create
                const newReview = await reviewService.createReview(lessonId, rating, comment);
                setReviews([newReview, ...reviews]);
                toast.success("Review posted");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        try {
            await reviewService.deleteReview(id);
            setReviews(reviews.filter(r => r._id !== id));
            toast.success("Review deleted");
        } catch {
            toast.error("Failed to delete review");
        }
    };

    const userHasReview = reviews.some(r => r.userId._id === user?.id);

    return (
        <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Star className="text-yellow-400 fill-yellow-400" />
                Reviews ({reviews.length})
            </h2>

            {isAuthenticated && !userHasReview && !editingReview && (
                <ReviewForm lessonId={lessonId} onReviewAdded={handleAddReview} />
            )}

            {editingReview && (
                <ReviewForm
                    lessonId={lessonId}
                    existingReview={editingReview}
                    onReviewAdded={handleAddReview}
                    onCancelEdit={() => setEditingReview(null)}
                />
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="text-gray-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-gray-400 italic">No reviews yet. Be the first to share your thoughts!</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-gray-800/50 p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-600/20 p-2 rounded-full">
                                        <User className="text-purple-400" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{review.userId.name}</div>
                                        <div className="text-xs text-gray-400">{formatDate(review.createdAt)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-900/50 px-3 py-1 rounded-full">
                                    <span className="text-yellow-400 font-bold">{review.rating}</span>
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{review.comment}</p>

                            {(user?.id === review.userId._id || user?.role === 'admin') && (
                                <div className="flex items-center gap-4 text-sm border-t border-white/5 pt-3 mt-3">
                                    {user.id === review.userId._id && (
                                        <button
                                            onClick={() => setEditingReview(review)}
                                            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    )}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this review? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(review._id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
