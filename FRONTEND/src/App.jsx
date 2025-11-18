import React from 'react';
import { Music, Play, Award, Users } from 'lucide-react';

export default function HomePage() {
  const handleSignIn = () => {
    // Navigate to sign in page
    
    console.log('Navigate to Sign In');
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    console.log('Navigate to Sign Up');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Stringz</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
            <button
  onClick={handleSignIn}
  className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-black transform hover:scale-105 transition duration-200 shadow-lg0"
>
  Log In
</button>
              <button
                onClick={handleSignUp}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Guitar</span>
            <br />
            One Lesson at a Time
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Learn from expert instructors with high-quality video lessons. 
            Start your musical journey today for just ₹99 per lesson.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleSignUp}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-200 shadow-2xl"
            >
              Get Started Free
            </button>
            <button
              onClick={handleSignIn}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition duration-200"
            >
              Browse Lessons
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition duration-300">
            <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">HD Video Lessons</h3>
            <p className="text-gray-300">
              Crystal clear video quality with professional guitar instructors guiding you step by step.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition duration-300">
            <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Expert Instructors</h3>
            <p className="text-gray-300">
              Learn from experienced musicians with years of teaching and performing experience.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition duration-300">
            <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Learn at Your Pace</h3>
            <p className="text-gray-300">
              Access your lessons anytime, anywhere. Practice and replay as many times as you need.
            </p>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-8 py-4 shadow-2xl">
            <p className="text-white text-xl font-semibold">
              Just <span className="text-3xl font-bold">₹99</span> per lesson
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Music className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">Stringz</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Stringz. Master your guitar skills.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}