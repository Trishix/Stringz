import api from './api';

const studentService = {
    getDashboard: async () => {
        const response = await api.get('/student/dashboard');
        return response.data;
    },

    getPurchases: async () => {
        const response = await api.get('/student/purchases');
        return response.data;
    },

    checkAccess: async (lessonId) => {
        const response = await api.get(`/student/check-access/${lessonId}`);
        return response.data;
    },

    updateProgress: async (lessonId, duration, position) => {
        const response = await api.post('/student/progress', {
            lessonId,
            duration,
            position
        });
        return response.data;
    }
};

export default studentService;
