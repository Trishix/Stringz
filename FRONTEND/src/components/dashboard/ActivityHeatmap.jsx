import { useMemo } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ activeDates = [] }) => {
    // Generate dates for the last 365 days
    const { weeks, monthLabels } = useMemo(() => {
        const today = new Date();
        const endDate = today;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // 52 weeks * 7 = 364

        // Align start date to Sunday for clean grid
        const dayOfWeek = startDate.getDay();
        const alignedStartDate = new Date(startDate);
        alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

        const weeksArr = [];
        const monthsArr = [];
        let currentWeek = [];
        let lastMonth = -1;

        // Iterate day by day
        const currentDate = new Date(alignedStartDate);

        // We want 53 columns (weeks) to cover the year fully including potential overlap
        for (let i = 0; i < 53 * 7; i++) {
            const dateObj = new Date(currentDate);
            currentWeek.push(dateObj);

            if (currentWeek.length === 7) {
                weeksArr.push(currentWeek);

                // Content of week for month label judgment
                // Usually we label the month if the first day of the week is in that month
                // or if the month changed during this week (specifically logic varies)
                // GitHub puts label on the column where the new month starts
                const firstDayOfWeek = currentWeek[0];
                const month = firstDayOfWeek.getMonth();
                const monthName = firstDayOfWeek.toLocaleString('default', { month: 'short' });

                if (month !== lastMonth) {
                    monthsArr.push({ name: monthName, index: weeksArr.length - 1 });
                    lastMonth = month;
                }

                currentWeek = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return { weeks: weeksArr, monthLabels: monthsArr };
    }, []);

    const activeSet = useMemo(() => {
        return new Set((activeDates || []).map(d => new Date(d).toDateString()));
    }, [activeDates]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/5 w-full overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">Activity History</h3>

            <div className="min-w-[800px] overflow-hidden">
                {/* Month Labels */}
                <div className="flex mb-2 text-xs text-gray-400 relative h-4">
                    {monthLabels.map((month, i) => (
                        <div
                            key={i}
                            style={{ left: `${month.index * 14}px` }} // 14px approx width of column (w-3 + gap)
                            className="absolute"
                        >
                            {month.name}
                        </div>
                    ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex gap-[2px]">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[2px]">
                            {week.map((date, dIndex) => {
                                const isActive = activeSet.has(date.toDateString());
                                return (
                                    <motion.div
                                        key={dIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (wIndex * 7 + dIndex) * 0.0005 }}
                                        className={`w-3 h-3 rounded-sm ${isActive
                                                ? 'bg-purple-500 shadow-glow-purple-subtle'
                                                : 'bg-gray-700/30 hover:bg-gray-700'
                                            }`}
                                        title={date.toDateString()}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-700/30 rounded-sm"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
