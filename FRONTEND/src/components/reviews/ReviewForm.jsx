import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ lessonId, onReviewAdded, existingReview = null, onCancelEdit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        } else {
            setRating(5);
            setComment('');
        }
    }, [existingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error("Please add a comment");

        setIsSubmitting(true);
        try {
            await onReviewAdded({
                lessonId,
                rating,
                comment,
                id: existingReview?._id
            });
            setComment('');
            setRating(5);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                        <Star fill={star <= rating ? "currentColor" : "none"} size={24} />
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this lesson..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 min-h-[100px] mb-4 focus:ring-purple-500 focus:border-purple-500"
                required
            />

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Post Review')}
                </button>

                {existingReview && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;
