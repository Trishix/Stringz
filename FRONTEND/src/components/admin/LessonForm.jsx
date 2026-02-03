import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import lessonService from '../../services/lessonService';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const LessonForm = ({ lessonToEdit, onSuccess }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbFile, setThumbFile] = useState(null);
    const [generatedThumb, setGeneratedThumb] = useState(null);
    const fileInputRef = useRef(null);

    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);

            // Extract metadata
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration / 60; // to minutes
                setValue('duration', parseFloat(duration.toFixed(2)));

                // Generate thumbnail at 1s mark
                video.currentTime = 1;
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setGeneratedThumb(dataUrl);
            };

            video.src = URL.createObjectURL(file);
        }
    };

    useEffect(() => {
        if (lessonToEdit) {
            // Populate form
            Object.keys(lessonToEdit).forEach(key => {
                setValue(key, lessonToEdit[key]);
            });
            if (lessonToEdit.price === 0) {
                setValue('isFree', true);
            }
        } else {
            reset();
            setGeneratedThumb(null);
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
                    <div className="flex gap-2 items-center">
                        <input
                            {...register('price', { required: 'Price is required', min: 0 })}
                            type="number"
                            disabled={watch('isFree')}
                            className="mt-1 bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5 disabled:opacity-50"
                        />
                        <div className="flex items-center mt-1">
                            <input
                                type="checkbox"
                                id="isFree"
                                {...register('isFree')}
                                onChange={(e) => {
                                    setValue('isFree', e.target.checked);
                                    if (e.target.checked) setValue('price', 0);
                                }}
                                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="isFree" className="ml-2 text-sm text-gray-300">Free</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Duration (mins)</label>
                    <input
                        {...register('duration', { required: 'Duration is required' })}
                        type="number"
                        step="0.01"
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
                        onChange={handleVideoSelect}
                        className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {lessonToEdit && <p className="text-xs text-gray-500 mt-1">Leave empty to keep current video</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => setThumbFile(e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {generatedThumb && (
                            <div className="relative group w-32 h-20 rounded overflow-hidden border border-gray-600">
                                <img src={generatedThumb} alt="Generated" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Convert dataURL to file and set it
                                        fetch(generatedThumb)
                                            .then(res => res.blob())
                                            .then(blob => {
                                                const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
                                                setThumbFile(file);
                                                // Clear manual input if needed or just override
                                                toast.success('Thumbnail selected from video');
                                            });
                                    }}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white font-bold"
                                >
                                    Use This
                                </button>
                            </div>
                        )}
                    </div>
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
