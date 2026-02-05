import React, { useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export const FloatingNav = ({
    navItems,
    className
}) => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);
    const { logout, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Reset visibility when route changes
    React.useEffect(() => {
        setVisible(true);
    }, [location.pathname]);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious();

            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.nav
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit fixed top-4 sm:top-10 inset-x-0 mx-auto border border-purple-500/20 rounded-full bg-gray-900/80 backdrop-blur-md shadow-glow-purple-subtle z-50 pr-2 pl-4 sm:pl-8 py-2 items-center justify-center space-x-2 sm:space-x-4",
                    className
                )}>

                {/* Logo */}
                <Link to="/" className="mr-4 flex items-center">
                    <img src={logo} alt="Stringz" className="h-8 w-auto object-contain" />
                </Link>

                {navItems.map((navItem, idx) => {
                    const isActive = location.pathname === navItem.link || (navItem.link !== '/' && location.pathname.startsWith(navItem.link));
                    return (
                        <Link
                            key={`link=${idx}`}
                            to={navItem.link}
                            className={cn(
                                "relative items-center flex space-x-1 transition-colors",
                                isActive
                                    ? "text-purple-400 dark:text-purple-400 font-semibold"
                                    : "text-gray-300 hover:text-purple-400 dark:text-neutral-50"
                            )}
                        >
                            <span className="block sm:hidden">{navItem.icon}</span>
                            <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                            {isActive && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full" />
                            )}
                        </Link>
                    );
                })}

                {loading ? (
                    <div className="h-9 w-20 rounded-full bg-white/10 animate-pulse border border-white/5" />
                ) : isAuthenticated ? (
                    <button
                        onClick={logout}
                        className="border text-sm font-medium relative border-red-500/30 text-red-400 hover:text-white px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/30 backdrop-blur-md transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    >
                        <span>Logout</span>
                        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
                    </button>
                ) : (
                    <Link to="/login">
                        <button
                            className="border text-sm font-medium relative border-blue-500/30 text-white px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/30 backdrop-blur-md transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                            <span>Login</span>
                            <span
                                className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
                        </button>
                    </Link>
                )}
            </motion.nav>
        </AnimatePresence>
    );
};
