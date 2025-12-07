import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import lessonService from '../../services/lessonService';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const LessonForm = ({ lessonToEdit, onSuccess }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbFile, setThumbFile] = useState(null);

    useEffect(() => {
        if (lessonToEdit) {
            // Populate form
            Object.keys(lessonToEdit).forEach(key => {
                setValue(key, lessonToEdit[key]);
            });
        } else {
            reset();
        }
        setVideoFile(null);
        setThumbFile(null);
    }, [lessonToEdit, setValue, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', data.price);
        formData.append('duration', data.duration);
        formData.append('instructor', data.instructor);

        if (videoFile) formData.append('video', videoFile);
        if (thumbFile) formData.append('thumbnail', thumbFile);

        try {
            if (lessonToEdit) {
                await lessonService.updateLesson(lessonToEdit._id, formData);
                toast.success('Lesson updated successfully');
            } else {
                if (!videoFile) {
                    toast.error('Video file is required for new lessons');
                    setIsLoading(false);
                    return;
                }
                await lessonService.createLesson(formData);
                toast.success('Lesson created successfully');
            }
            reset();
            setVideoFile(null);
            setThumbFile(null);
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        type="text"
                        className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Instructor</label>
                    <input
                        {...register('instructor', { required: 'Instructor is required' })}
                        type="text"
                        className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                        {...register('category', { required: 'Category is required' })}
                        className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Price (₹)</label>
                    <input
                        {...register('price', { required: 'Price is required' })}
                        type="number"
                        className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Duration (mins)</label>
                    <input
                        {...register('duration', { required: 'Duration is required' })}
                        type="number"
                        className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Video File</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {lessonToEdit && <p className="text-xs text-gray-500 mt-1">Leave empty to keep current video</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbFile(e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {lessonToEdit && <p className="text-xs text-gray-500 mt-1">Leave empty to keep current thumbnail</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isLoading && <Loader className="animate-spin h-5 w-5" />}
                {lessonToEdit ? 'Update Lesson' : 'Create Lesson'}
            </button>
        </form>
    );
};

export default LessonForm;
