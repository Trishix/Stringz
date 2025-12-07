import api from './api';

const lessonService = {
    getAllLessons: async (page = 1, search = '', category = '', sort = '') => {
        let url = `/lessons?page=${page}&limit=12`; // 12 per page for grid
        if (search) url += `&search=${search}`;
        if (category && category !== 'All') url += `&category=${category}`;
        if (sort) url += `&sort=${sort}`;

        const response = await api.get(url);
        return response.data;
    },

    getLessonById: async (id) => {
        const response = await api.get(`/lessons/${id}`);
        return response.data;
    },

    createLesson: async (formData) => {
        const response = await api.post('/lessons', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateLesson: async (id, formData) => {
        const response = await api.put(`/lessons/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteLesson: async (id) => {
        const response = await api.delete(`/lessons/${id}`);
        return response.data;
    }
};

export default lessonService;
