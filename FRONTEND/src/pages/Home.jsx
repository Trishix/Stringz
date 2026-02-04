import { Link } from 'react-router-dom';
import { Play, Star, Clock, Award } from 'lucide-react';
// import { motion } from 'framer-motion'; // Removed framer-motion as it wasn't valid in package.json, using Tailwind transitions for now

import heroImage from '../assets/images/hero-guitar.jpg';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="relative px-4 pt-32 pb-16 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 overflow-hidden min-h-screen flex items-center">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url(${heroImage})` }}
                ></div>
                <div className="relative max-w-7xl w-full text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="block text-white">Master the Guitar</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">From Anywhere</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-xl text-gray-300">
                        Premium video courses from world-class instructors. Learn at your own pace and take your skills to the next level.
                    </p>
                    <div className="mt-10 flex justify-start gap-4">
                        <Link to="/lessons" className="inline-flex items-center px-8 py-3 border border-white/20 text-base font-medium rounded-full text-white bg-purple-600/30 hover:bg-purple-600/50 backdrop-blur-md shadow-glow-purple transition-all hover:scale-105 shadow-glow-purple-hover">
                            <Play className="w-5 h-5 mr-2" fill="currentColor" /> Browse Lessons
                        </Link>
                        <Link to="/signup" className="inline-flex items-center px-8 py-3 border border-white/20 text-base font-medium rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Scrollable Content Wrapper */}
            <div className="bg-gray-900">
                <div className="min-h-screen flex flex-col justify-center py-12">
                    {/* Features Section */}
                    <section className="py-12 bg-gray-900">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                    Why Choose Stringz?
                                </h2>
                                <p className="mt-4 text-gray-400">Everything you need to become a pro guitarist.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-2">
                                    <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                        <Play className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">HD Video Lessons</h3>
                                    <p className="text-sm text-gray-400">Crystal clear 4K video quality with multiple camera angles to see every finger placement.</p>
                                </div>

                                <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all hover:-translate-y-2">
                                    <div className="bg-pink-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                        <Award className="w-6 h-6 text-pink-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Expert Instructors</h3>
                                    <p className="text-sm text-gray-400">Learn from verified professional guitarists with years of teaching and touring experience.</p>
                                </div>

                                <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2">
                                    <div className="bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                        <Clock className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Lifetime Access</h3>
                                    <p className="text-sm text-gray-400">Pay once, own forever. Revisit lessons anytime, anywhere, on any device.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="relative py-12 bg-gray-900">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
                        <div className="relative max-w-4xl mx-auto px-4 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h2>
                            <p className="text-lg text-gray-300 mb-8">Join thousands of students learning guitar on Stringz today.</p>
                            <Link to="/signup" className="inline-block bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Join Stringz Now
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
