import { Play, Award, Users, Heart } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
                        About Stringz
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We are passionate about making music education accessible, engaging, and effective for everyone, everywhere.
                    </p>
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all text-center">
                        <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Community First</h3>
                        <p className="text-gray-400">Building a supportive community of learners and mentors who grow together.</p>
                    </div>

                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all text-center">
                        <div className="bg-pink-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="w-8 h-8 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
                        <p className="text-gray-400">Providing the highest quality video lessons from world-class verified instructors.</p>
                    </div>

                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all text-center">
                        <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Passion</h3>
                        <p className="text-gray-400">Fueled by a deep love for music and the joy of teaching the next generation.</p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-gray-800/30 rounded-3xl p-8 md:p-12 border border-white/10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Stringz started with a simple idea: that learning guitar shouldn't be boring or restricted by location.
                            We realized that while there are many tutorials online, finding a structured, high-quality, and interactive
                            learning path was difficult.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Today, Stringz connects aspiring guitarists with expert mentors through a seamless digital platform.
                            Whether you're picking up a guitar for the first time or looking to master complex solos,
                            we're here to guide every strum of your journey.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
