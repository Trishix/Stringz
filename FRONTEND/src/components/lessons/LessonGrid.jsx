import LessonCard from './LessonCard';
import Loader from '../common/Loader';

const LessonGrid = ({ lessons, loading, emptyMessage = "No lessons found.", purchased = false }) => {
    if (loading) {
        return <div className="py-20"><Loader /></div>;
    }

    if (!lessons || lessons.length === 0) {
        return (
            <div className="py-20 text-center text-gray-400">
                <p className="text-xl">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} purchased={purchased} />
            ))}
        </div>
    );
};

export default LessonGrid;
