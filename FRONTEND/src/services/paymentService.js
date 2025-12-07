import api from './api';

const paymentService = {
    createOrder: async (lessonId) => {
        const response = await api.post('/payments/create-order', { lessonId });
        return response.data;
    },

    verifyPayment: async (paymentData) => {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    },

    getUserPurchases: async () => {
        const response = await api.get('/student/purchases');
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await api.get('/student/dashboard');
        return response.data;
    },

    checkAccess: async (lessonId) => {
        const response = await api.get(`/student/check-access/${lessonId}`);
        return response.data;
    }
};

export default paymentService;
