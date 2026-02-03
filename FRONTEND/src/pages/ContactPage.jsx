import { Mail, Phone, MapPin, Send, Loader as LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContactPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/contact', data);
            toast.success('Message sent successfully!');
            reset();
        } catch (error) {
            console.error('Contact error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Have questions about our guitar lessons? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/10 p-3 rounded-xl">
                                        <Mail className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Email</h4>
                                        <p className="text-gray-400">trishitofficial@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/10 p-3 rounded-xl">
                                        <Phone className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Phone</h4>
                                        <p className="text-gray-400">+91 7890341889</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/10 p-3 rounded-xl">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Office</h4>
                                        <p className="text-gray-400">Student Center, Rishihood University<br />Sonipat, Haryana, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800/50 p-8 rounded-2xl border border-white/10 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                {...register('name', { required: 'Name is required' })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                id="message"
                                rows="4"
                                {...register('message', { required: 'Message is required' })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="How can we help you?"
                            ></textarea>
                            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full border border-purple-500/30 bg-purple-600/20 hover:bg-purple-600/40 backdrop-blur-md shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
