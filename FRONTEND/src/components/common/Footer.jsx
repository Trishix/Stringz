import { Github, Twitter, Instagram } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <img src={logo} alt="Stringz" className="h-10 mb-4" />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Master the art of guitar with our premium video courses. Learn from the best instructors at your own pace.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/lessons" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Browse Lessons</a></li>
                            <li><a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">About Us</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 text-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Stringz. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
