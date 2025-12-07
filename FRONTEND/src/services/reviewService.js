import api from './api';

const reviewService = {
    getLessonReviews: async (lessonId) => {
        const response = await api.get(`/reviews/lesson/${lessonId}`);
        return response.data;
    },

    createReview: async (lessonId, rating, comment) => {
        const response = await api.post('/reviews', { lessonId, rating, comment });
        return response.data;
    },

    updateReview: async (id, rating, comment) => {
        const response = await api.put(`/reviews/${id}`, { rating, comment });
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default reviewService;
