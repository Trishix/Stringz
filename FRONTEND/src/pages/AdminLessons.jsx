import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import lessonService from '../services/lessonService';
import LessonForm from '../components/admin/LessonForm';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const AdminLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    const fetchLessons = async () => {
        try {
            // Fetch all lessons (assuming pagination handled or high limit for admin)
            // For admin table we usually want all or paginated table. Using standard get for now.
            const data = await lessonService.getAllLessons(1, '', '', '', 100); // Fetch up to 100
            setLessons(data.lessons);
        } catch (error) {
            console.error("Failed to fetch lessons", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            try {
                await lessonService.deleteLesson(id);
                setLessons(lessons.filter(l => l._id !== id));
                toast.success("Lesson deleted");
            } catch (error) {
                toast.error("Failed to delete lesson");
            }
        }
    }

    const handleEdit = (lesson) => {
        setEditingLesson(lesson);
        setShowForm(true);
    }

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingLesson(null);
        fetchLessons();
    }

    if (loading) return <div className="min-h-screen pt-20 bg-gray-900"><Loader /></div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Lessons</h1>
                    <button
                        onClick={() => { setEditingLesson(null); setShowForm(true); }}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} /> Add New Lesson
                    </button>
                </div>

                {/* Modal for Form */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-white/10 relative">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h2>
                            <LessonForm lessonToEdit={editingLesson} onSuccess={handleFormSuccess} />
                        </div>
                    </div>
                )}

                <div className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lesson</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {lessons.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-16 bg-gray-700 rounded overflow-hidden shrink-0">
                                                    {lesson.thumbnailUrl && <img src={lesson.thumbnailUrl} alt="" className="h-full w-full object-cover" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white line-clamp-1">{lesson.title}</div>
                                                    <div className="text-sm text-gray-400">{lesson.instructor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.category === 'beginner' ? 'bg-green-100 text-green-800' :
                                                    lesson.category === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {lesson.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            ₹{lesson.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {lesson.salesCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(lesson)}
                                                className="text-purple-400 hover:text-purple-300 mr-3"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lesson._id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLessons;
