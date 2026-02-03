import { useMemo } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ activeDates = [] }) => {
    // Generate dates for the last 365 days
    const dates = useMemo(() => {
        const days = [];
        const today = new Date();
        // Start from 364 days ago
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        return days;
    }, []);

    // Create a Set of active date strings for O(1) lookup
    const activeSet = useMemo(() => {
        return new Set(activeDates.map(d => new Date(d).toDateString()));
    }, [activeDates]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 w-full overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">Activity History</h3>

            <div className="flex gap-1 min-w-[800px]">
                {/* We can group by weeks for a GitHub-like style, or just a grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1 w-full">
                    {dates.map((date, index) => {
                        const isActive = activeSet.has(date.toDateString());
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.001 }}
                                className={`w-3 h-3 rounded-sm ${isActive
                                        ? 'bg-purple-500 shadow-glow-purple-subtle'
                                        : 'bg-gray-700/50 hover:bg-gray-700'
                                    }`}
                                title={date.toDateString()}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-700/50 rounded-sm"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
