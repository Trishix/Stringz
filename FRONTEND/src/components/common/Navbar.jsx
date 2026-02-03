import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Home, BookOpen, LayoutDashboard, User } from 'lucide-react'; // Import icons
import { FloatingNav } from '../ui/FloatingNav';

const Navbar = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    if (!isAdmin) {
        navItems.push({
            name: "Lessons",
            link: "/lessons",
            icon: <BookOpen className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
        navItems.push({
            name: "Contact",
            link: "/contact",
            icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
        // navItems.push({
        //     name: "About",
        //     link: "/about",
        //     icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
        // });
    }

    if (isAuthenticated) {
        navItems.push({
            name: "Dashboard",
            link: isAdmin ? "/admin" : "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
    }

    const location = useLocation();

    // Hide navbar on auth pages
    if (["/login", "/signup"].includes(location.pathname)) {
        return null;
    }

    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
};

export default Navbar;
