import { useState, useEffect } from 'react';
import lessonService from '../services/lessonService';
import LessonGrid from '../components/lessons/LessonGrid';
import LessonFilters from '../components/lessons/LessonFilters';
import { useSearchParams } from 'react-router-dom';

const Catalog = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'All',
        sort: searchParams.get('sort') || ''
    });

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1
    });

    useEffect(() => {
        // Update URL params
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category !== 'All') params.category = filters.category;
        if (filters.sort) params.sort = filters.sort;
        setSearchParams(params);

        const fetchLessons = async () => {
            setLoading(true);
            try {
                const data = await lessonService.getAllLessons(pagination.page, filters.search, filters.category, filters.sort);
                setLessons(data.lessons);
                setPagination(prev => ({ ...prev, totalPages: data.totalPages }));
            } catch (error) {
                console.error("Failed to fetch lessons", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchLessons();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters, pagination.page]);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Explore Our Catalogue
                </h1>

                <LessonFilters filters={filters} setFilters={setFilters} />

                <LessonGrid lessons={lessons} loading={loading} />

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-4">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-gray-800 rounded-lg">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
